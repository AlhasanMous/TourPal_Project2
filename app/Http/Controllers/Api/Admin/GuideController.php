<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VerifyGuideRequest;
use App\Http\Resources\Admin\AdminGuideResource;
use App\Models\Guide;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Admin\StoreGuideRequest;

class GuideController extends Controller
{
    // GET /api/admin/guides
    public function index(Request $request): JsonResponse
    {
        $query = Guide::with(['user', 'city', 'images'])
            ->withCount(['bookings', 'reviews']);

        // فلترة حسب حالة التحقق
        if (!empty($request->status)) {
            $query->where('verification_status', $request->status);
        }

        // فلترة حسب المدينة
        if (!empty($request->city_id)) {
            $query->where('city_id', $request->city_id);
        }

        // بحث باسم المرشد
        if (!empty($request->search)) {
            $query->whereHas(
                'user',
                fn($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
            );
        }

        $guides = $query->latest()->paginate(20);

        return response()->json([
            'guides' => AdminGuideResource::collection($guides),
            'meta'   => [
                'current_page' => $guides->currentPage(),
                'last_page'    => $guides->lastPage(),
                'per_page'     => $guides->perPage(),
                'total'        => $guides->total(),
            ],
        ]);
    }

    // GET /api/admin/guides/{guide}
    public function show(Guide $guide): JsonResponse
    {
        $guide->load(['user', 'city', 'images'])
            ->loadCount(['bookings', 'reviews']);

        return response()->json([
            'guide' => new AdminGuideResource($guide),
        ]);
    }
    // POST /api/admin/guides
    public function store(StoreGuideRequest $request): JsonResponse
    {
        // تحقق إن المستخدم ما عنده profile مرشد مسبقاً
        $exists = Guide::where('user_id', $request->user_id)->exists();

        if ($exists) {
            return response()->json([
                'message' => 'هذا المستخدم لديه حساب مرشد مسبقاً',
            ], 422);
        }

        $guide = DB::transaction(function () use ($request) {
            $guide = Guide::create([
                'user_id'             => $request->user_id,
                'city_id'             => $request->city_id,
                'verification_status' => 'pending',
                'specializations'     => $request->specializations,
                'availability'        => $request->availability ?? [],
            ]);

            // تأكد إن المستخدم عنده role guide
            $user = $guide->user;
            if (!$user->hasRole('guide')) {
                $user->assignRole('guide');
            }

            return $guide;
        });

        $guide->load(['user', 'city']);

        return response()->json([
            'message' => 'تم إنشاء حساب المرشد بنجاح',
            'guide'   => new AdminGuideResource($guide),
        ], 201);
    }

    // POST /api/admin/guides/{guide}/verify
    public function verify(VerifyGuideRequest $request, Guide $guide): JsonResponse
    {
        // ما نعيد التحقق من مرشد محقق مسبقاً
        if ($guide->verification_status === 'approved' && $request->action === 'verify') {
            return response()->json([
                'message' => 'المرشد محقق مسبقاً',
            ], 422);
        }

        DB::transaction(function () use ($request, $guide) {
            if ($request->action === 'verify') {
                $guide->update([
                    'verification_status' => 'approved',
                    'verified_at'         => now(),
                    'rejection_reason'    => null,
                ]);

                // إشعار للمرشد
                Notification::create([
                    'user_id' => $guide->user_id,
                    'type'    => 'guide_verified',
                    'data'    => [
                        'message' => 'تهانينا! تم اعتماد حسابك كمرشد سياحي',
                    ],
                ]);
            } else {
                $guide->update([
                    'verification_status' => 'rejected',
                    'verified_at'         => null,
                    'rejection_reason'    => $request->rejection_reason,
                ]);

                // إشعار للمرشد
                Notification::create([
                    'user_id' => $guide->user_id,
                    'type'    => 'guide_rejected',
                    'data'    => [
                        'message'          => 'نأسف، لم يتم اعتماد حسابك كمرشد سياحي',
                        'rejection_reason' => $request->rejection_reason,
                    ],
                ]);
            }
        });

        $guide->load(['user', 'city']);

        $message = $request->action === 'verify'
            ? 'تم اعتماد المرشد بنجاح'
            : 'تم رفض طلب المرشد';

        return response()->json([
            'message' => $message,
            'guide'   => new AdminGuideResource($guide),
        ]);
    }

    // GET /api/admin/guides/pending
    public function pending(): JsonResponse
    {
        $guides = Guide::with(['user', 'city'])
            ->where('verification_status', 'pending')
            ->latest()
            ->paginate(20);

        return response()->json([
            'guides' => AdminGuideResource::collection($guides),
            'meta'   => [
                'current_page' => $guides->currentPage(),
                'last_page'    => $guides->lastPage(),
                'per_page'     => $guides->perPage(),
                'total'        => $guides->total(),
            ],
        ]);
    }
}
