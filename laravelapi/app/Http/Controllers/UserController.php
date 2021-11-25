<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use http\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Psy\Util\Str;

use Laravel\Passport\TokenRepository;
use Laravel\Passport\RefreshTokenRepository;

use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;

class UserController extends Controller
{
    function register(RegisterRequest $req)
    {
        try {
            $user = User::create([
                'name' => $req->input('name'),
                'email' => $req->input('email'),
                'password' => Hash::make($req->input('password')),
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 400);
        }


        return $user;
    }

    function login(Request $req)
    {

        try {
            if (Auth::attempt($req->only('email', 'password'))) {
                /** @var User $user */
                $user = Auth::user();
                //old token
//                $token = $user->createToken('app')->accessToken;
                $client = DB::table('oauth_clients')
                    ->where('password_client', true)
                    ->first();

                $http = new \GuzzleHttp\Client;
                $response = $http->post('http://127.0.0.1:8001/oauth/token', [
                    'form_params' => [
                        'grant_type' => 'password',
                        'client_id' => $client->id,
                        'client_secret' => $client->secret,
                        'username' => $req['email'],
                        'password' => $req['password']
                    ],

                ]);
                $tokens = $response->getBody()->getContents();

                return response()->json([
                    'message' => 'success',
                    'tokens' => json_decode($tokens),
                    'user' => new UserResource($user),
                ]);
            }
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 400);
        }


        return response()->json([
            'message' => 'Invalid username/password'
        ], 401);

    }

    //Token-ul pe care il primesc din requst nu pot sa il transmit
    //mai departe pentru a revoke('id), nu corespunde cu id-ul din DB.
    //
    //Functia imi da id-ul care face match-ul in DB => pot sa dau revoke('id)
    public function getTokenId($tokenFromRequest)
    {
        return (new Parser(new JoseEncoder()))->parse($tokenFromRequest)->claims()->all()['jti'];
    }

    public function logout(Request $req)
    {
        $token = $req->input('token');

        $access_token = $this->getTokenId($token);

        $tokenRepository = app(TokenRepository::class);
        try {
            $tokenRepository->revokeAccessToken($access_token);
            DB::table('oauth_refresh_tokens')
                ->where('access_token_id', $access_token)
                ->update(['revoked' => 1]);
            return response()->json([
                'message' => "You are log out successfully!"
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    //verifica si pentru revoked
    //params [ Authorization - access token-ul, refresh_token]
    public function getUser(Request $req)
    {
        $user = Auth::user();
        $access_token_header = $this->getTokenId($req->bearerToken());
        $client = DB::table('oauth_clients')
            ->where('password_client', true)
            ->first();

        try {
            $access_token = DB::table('oauth_access_tokens')
                ->where('id', $access_token_header)
                ->first();

            $refresh_token = DB::table('oauth_refresh_tokens')
                ->where('access_token_id', $access_token_header)
                ->first();

            $refresh_token_decrypt = $req->header('refresh_token');

            //verificare token-uri daca sunt revoked
            if ($access_token->revoked == 1 || $refresh_token->revoked == 1) {
                return response()->json([
                    'message' => 'Token Revoked... LOGIN NEEDED',
                    'value' => false,
                ], 400);
            }

            //Daca access_token & refresh_token sunt available returneaza USER (resources)
            if ($refresh_token->expires_at > Carbon::now() && $access_token->expires_at > Carbon::now()) {
                $token = null;
                return Auth::user();
            }

            // '<' - expirat
            if ($refresh_token->expires_at > Carbon::now() && $access_token->expires_at < Carbon::now()) {
//                return "Access Token Expirat";

                $response = Http::asForm()->post('http://127.0.0.1:8001/oauth/token', [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refresh_token_decrypt,
                    'client_id' => $client->id,
                    'client_secret' => $client->secret,
                    'scope' => '',
                ]);

                $tokens = $response->getBody()->getContents();

                return response()->json([
                    'message' => 'tokens refreshed',
                    'value' => true,
                    'tokens' => json_decode($tokens),
                    'user' => new UserResource($user),
                ]);
            }
            if ($refresh_token->expires_at < Carbon::now()) {
                return response()->json([
                    'message' => 'Refresh Token Expired! Need login!',
                    'value' => false,
                ], 400);
            }


        } catch
        (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ], 404);
        }

    }

    public function resetPasswordRequest(ForgotRequest $req)
    {
        $email = $req->input('email');

        if (User::where('email', $email)->doesntExist()) {
            return response()->json([
                'message' => 'User don\'t exists!'
            ], 404);
        }

        $token = \Illuminate\Support\Str::random(10);


        try {
            DB::table('password_resets')->insert([
                'email' => $email,
                'token' => $token
            ]);
            //SEND EMAIL
            Mail::send('Mails.resetPassword', ['token' => $token], function (\Illuminate\Mail\Message $message) use ($email) {
                $message->to($email);
                $message->subject('Reset your password');
            });

            return response()->json([
                'message' => 'Check your email!'
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'message' => $exception->getMessage()
            ]);
        }
    }

    public function checkTokenResetPassword(Request $req)
    {
        $token = $req->input('token');

        if (!$tokenCheck = DB::table('password_resets')->where('token', $token)->first()) {
            return response()->json([
                'message' => 'Invalid Token!',
                'value' => false,
            ], 400);
        } else {
            return response()->json([
                'value' => true,
                'message' => 'Valid Token'
            ]);
        }

    }

    public function resetPassword(ResetRequest $req)
    {
        $token = $req->input('token');

        if (!$passwordResets = DB::table('password_resets')->where('token', $token)->first()) {
            return response()->json([
                'message' => 'Invalid Token!'
            ], 400);
        }

        /** @var User $user */
        if (!$user = User::where('email', $passwordResets->email)->first()) {
            return response()->json([
                'message' => 'User don\'t exist!'
            ], 400);
        }

        $user->password = Hash::make($req->input('password'));
        $user->save();

        //invalidate token when password was reseted
        DB::table('password_resets')
            ->where('token', $token)
            ->update(['token' => 0]);

        return response()->json([
            'message' => "Your password was changed successfully!"
        ]);
    }
}
