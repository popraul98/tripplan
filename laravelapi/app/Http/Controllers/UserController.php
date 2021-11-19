<?php

namespace App\Http\Controllers;

use App\Http\Requests\ForgotRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetRequest;
use App\Models\User;
use http\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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

                return response()->json([
                    'message' => 'success',
                    'token' => $token,
                    'user' => $user,
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
        $token = $req->input('id');

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

    public function getUser()
    {
        return Auth::user();
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
                'message' => 'Invalid Token!'
            ], 400);
        }else {
            return response()->json([
                'value'=>true,
                'message'=>'Valid Token'
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

        return response()->json([
            'message' => "Your password was changed successfully!"
        ]);
    }
}
