<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guide\StoreGuideProfileRequest;
use App\Http\Requests\Guide\UpdateGuideProfileRequest;
use App\Http\Resources\GuideResource;
use App\Services\GuideProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuideProfileController extends Controller
{
    public function __construct(private GuideProfileService $profileService) {}

    // ─────────────────────────────────────────
    // POST /api/guide/profile
    // Guide ينشئ profile تبعه
    // ─────────────────────────────────────────
public function store(StoreGuideProfileRequest $request): JsonResponse
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image');
    }

    $guide = $this->profileService->createProfile(
        $request->user(),
        $data
    );

    $guide->load(['user', 'city', 'images']);

    return response()->json([
        'message' => 'تم إنشاء حساب المرشد بنجاح، في انتظار مراجعة الإدارة',
        'guide'   => new GuideResource($guide),
    ], 201);
}
    // ─────────────────────────────────────────
    // GET /api/guide/profile
    // Guide يشوف profile تبعه
    // ─────────────────────────────────────────
    public function show(Request $request): JsonResponse
    {
        $guide = $this->profileService->getProfile($request->user());

        $guide->load(['user', 'city', 'images']);

        return response()->json([
            'guide' => new GuideResource($guide),
        ]);
    }

    // ─────────────────────────────────────────
    // PUT /api/guide/profile
    // Guide يعدل profile تبعه
    // ─────────────────────────────────────────
public function update(UpdateGuideProfileRequest $request): JsonResponse
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image');
    }

    $guide = $this->profileService->updateProfile(
        $request->user(),
        $data
    );

    return response()->json([
        'message' => 'تم تحديث الملف الشخصي بنجاح',
        'guide'   => new GuideResource($guide),
    ]);
}
}