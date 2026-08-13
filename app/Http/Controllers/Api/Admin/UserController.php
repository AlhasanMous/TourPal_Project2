<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Admin\AdminUserResource;
use App\Models\User;
use App\Services\Admin\AdminUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private AdminUserService $userService) {}

    // GET /api/admin/users
    // GET /api/admin/users?search=hassan
    // GET /api/admin/users?role=guide
    // GET /api/admin/users?deleted=true
    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->getAll($request->only([
            'search',   
            'role',
            'deleted',
        ]));

        return response()->json([
            'users' => AdminUserResource::collection($users),
            'meta'  => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ]);
    }

    // GET /api/admin/users/{user}
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->findById($id);

        return response()->json([
            'user' => new AdminUserResource($user),
        ]);
    }

    // PUT /api/admin/users/{user}
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user = $this->userService->update($user, $request->validated());

        return response()->json([
            'message' => 'تم تحديث بيانات المستخدم بنجاح',
            'user'    => new AdminUserResource($user),
        ]);
    }

    // DELETE /api/admin/users/{user}
    public function destroy(User $user): JsonResponse
    {
        try {
            $this->userService->delete($user);

            return response()->json([
                'message' => 'تم حذف المستخدم بنجاح',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // POST /api/admin/users/{user}/restore
    public function restore(int $id): JsonResponse
    {
        $user = User::withTrashed()->findOrFail($id);
        $this->userService->restore($user);

        return response()->json([
            'message' => 'تم استعادة حساب المستخدم بنجاح',
        ]);
    }

    // POST /api/admin/users/{user}/toggle-verification
    public function toggleVerification(User $user): JsonResponse
    {
        $user = $this->userService->toggleVerification($user);

        $status = $user->email_verified_at ? 'تم تفعيل الحساب' : 'تم إلغاء تفعيل الحساب';

        return response()->json([
            'message'           => $status,
            'email_verified_at' => $user->email_verified_at,
        ]);
    }
}