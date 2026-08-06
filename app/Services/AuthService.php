<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
class AuthService
{
    public function register(array $data): array
{
    return DB::transaction(function () use ($data) {
        $user = User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => Hash::make($data['password']),
        ]);

        $user->assignRole($data['role']);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    });
}

    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password_hash)) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني أو كلمة المرور غير صحيحة'],
            ]);
        }

        // احذف التوكنات القديمة وأنشئ جديد
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

public function logout(User $user): void
{
    /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
    $token = $user->currentAccessToken();
    $token?->delete();
}
}