<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\ChangePasswordRequest;

class AuthController extends Controller
{
    //
     public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'message' => 'تم التسجيل بنجاح',
            'user'    => new UserResource($result['user']),
            'token'   => $result['token'],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'user'    => new UserResource($result['user']),
            'token'   => $result['token'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()->load('roles')),
        ]);
    }
    // POST /api/auth/change-password
public function changePassword(ChangePasswordRequest $request): JsonResponse
{
    $user = $request->user();

    // تحقق من كلمة المرور الحالية
    if (!Hash::check($request->current_password, $user->password_hash)) {
        return response()->json([
            'message' => 'كلمة المرور الحالية غير صحيحة',
            'errors'  => [
                'current_password' => ['كلمة المرور الحالية غير صحيحة'],
            ],
        ], 422);
    }

    $user->update([
        'password_hash' => Hash::make($request->password),
    ]);

    // احذف كل التوكنات القديمة — يجبره على تسجيل الدخول من جديد
    $user->tokens()->delete();

    return response()->json([
        'message' => 'تم تغيير كلمة المرور بنجاح، يرجى تسجيل الدخول مجدداً',
    ]);
}

}
