<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TouristMatch;
use App\Services\MatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchingController extends Controller
{
    public function __construct(private MatchingService $matchingService) {}

    // ─────────────────────────────────────────
    // GET /api/matching
    // حساب + تخزين + إرجاع النتائج
    // ─────────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $matches = $this->matchingService->getMatches($request->user());

        return response()->json([
            'total'   => count($matches),
            'matches' => $matches,
        ]);
    }

    // ─────────────────────────────────────────
    // GET /api/matching/connections
    // السياح المتصلين (accepted)
    // ─────────────────────────────────────────
    public function connections(Request $request): JsonResponse
    {
        $connections = $this->matchingService->getConnections($request->user()->id);

        return response()->json([
            'total'       => $connections->count(),
            'connections' => $connections,
        ]);
    }

    // ─────────────────────────────────────────
    // POST /api/matching/{match}/connect
    // بعث Connection Request
    // ─────────────────────────────────────────
    public function connect(Request $request, TouristMatch $match): JsonResponse
    {
        $match = $this->matchingService->connect($match, $request->user()->id);

        return response()->json([
            'message' => 'تم إرسال طلب التواصل بنجاح',
            'match'   => [
                'id'     => $match->id,
                'status' => $match->status,
            ],
        ]);
    }

    // ─────────────────────────────────────────
    // PATCH /api/matching/{match}/respond
    // قبول أو رفض
    // ─────────────────────────────────────────
    public function respond(Request $request, TouristMatch $match): JsonResponse
    {
        $request->validate([
            'action' => ['required', 'in:accept,decline'],
        ], [
            'action.required' => 'الإجراء مطلوب',
            'action.in'       => 'الإجراء يجب أن يكون accept أو decline',
        ]);

        $match = $this->matchingService->respond(
            $match,
            $request->action,
            $request->user()->id
        );

        $message = $request->action === 'accept'
            ? 'تم قبول طلب التواصل'
            : 'تم رفض طلب التواصل';

        return response()->json([
            'message' => $message,
            'match'   => [
                'id'     => $match->id,
                'status' => $match->status,
            ],
        ]);
    }
}