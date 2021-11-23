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
                $token = $user->createToken('app')->accessToken;
                $client = DB::table('oauth_clients')
                    ->where('password_client', true)
                    ->first();

//                $http = new Client();
//                $response = $http->post(url('oauth/token'), array(
//                    'form_params' => array(
//                        'grant_type' => 'password',
//                        'client_id' => $client->id,
//                        'client_secret' => $client->secret,
//                        'email' => $req['email'],
//                        'password' => $req['password']
//                    )));
//                return json_decode($response->getBody(), true);

                $response = Http::asForm()->post('http://localhost:3000/oauth/token', [
                    'grant_type' => 'password',
                    'client_id' => $client->id,
                    'client_secret' => $client->secret,
                    'email' => $req->input('email'),
                    'password' => $req->input('password'),
                    'scope' => '*',
                ]);

                return $response->json();

//                return response()->json([
//                    'message' => 'success',
//                    'token' => $token,
//                    'user' => new UserResource($user),
//                ]);
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

        $tokenId = $this->getTokenId($token);

        $tokenRepository = app(TokenRepository::class);
        try {
            $tokenRepository->revokeAccessToken($tokenId);
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
    public function getUser(Request $req)
    {
        $header = $req->bearerToken();
        $tokenId = $this->getTokenId($header);
        try {
            $token = DB::table('oauth_access_tokens')
                ->where('id', $tokenId)
                ->whereDate('expires_at', '>', Carbon::now())
                ->first();
            if ($token) {
                $token = null;
                return Auth::user();
            } else {

//                $http = new GuzzleHttp\Client;
//
//                $response = $http->post('http://localhost:3000/oauth/token', [
//                    'form_params' => [
//                        'grant_type' => 'authorization_code',
//                        'client_id' => '5',
//                        'client_secret' => 'R04JdQoijxxrtmQVRwVR0vrGoNQiOssfLaXVeJIH',
//                        'redirect_uri' => 'http://localhost:3000/get-token',
//                        'code' => $req->code,
//                    ],
//                ]);
//
//                return json_decode((string)$response->getBody(), true);

                $response = Http::asForm()->post('http://localhost:3000/oauth/token', [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => 'the-refresh-token',
                    'client_id' => 6,
                    'client_secret' => 'R04JdQoijxxrtmQVRwVR0vrGoNQiOssfLaXVeJIH',
                    'scope' => '',
                ]);

                return $response->json();

                return  "false";
            }
        } catch (\Exception $exception) {
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
