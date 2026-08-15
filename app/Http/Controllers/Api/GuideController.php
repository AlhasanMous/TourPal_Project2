<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GuideResource;
use App\Models\Guide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuideController extends Controller
{
    // ─────────────────────────────────────────
    // GET /guides
    // عرض المرشدين المعتمدين مع فلترة
    // ─────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $guides = Guide::with(['user', 'city', 'images'])
            ->where('verification_status', 'approved')
            ->when(
                $request->city_id,
                fn($q) =>
                $q->where('city_id', $request->city_id)
            )
            ->when(
                $request->specialization,
                fn($q) =>
                $q->where('specializations', 'like', '%' . $request->specialization . '%')
            )
            ->paginate(15);

        return response()->json([
            'guides' => GuideResource::collection($guides),
            'meta'   => [
                'current_page' => $guides->currentPage(),
                'last_page'    => $guides->lastPage(),
                'per_page'     => $guides->perPage(),
                'total'        => $guides->total(),
            ],
        ]);
    }

    // ─────────────────────────────────────────
    // GET /guides/{guide}
    // تفاصيل مرشد معين
    // ─────────────────────────────────────────
    public function show(Guide $guide): JsonResponse
    {
        // بس المرشدين المعتمدين يظهروا للعامة
        if ($guide->verification_status !== 'approved') {
            return response()->json([
                'message' => 'هذا المرشد غير متاح',
            ], 404);
        }

        $guide->load(['user', 'city', 'images']);

        return response()->json([
            'guide' => new GuideResource($guide),
        ]);
    }
}
