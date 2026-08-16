<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TouristMatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchingController extends Controller
{
    // GET /api/admin/matching
    public function index(Request $request): JsonResponse
    {
        $query = TouristMatch::with(['user1', 'user2', 'city', 'workspace']);

        if (!empty($request->status)) {
            $query->where('status', $request->status);
        }

        if (!empty($request->city_id)) {
            $query->where('match_city_id', $request->city_id);
        }

        $matches = $query->latest()->paginate(20);

        return response()->json([
            'matches' => $matches->map(fn($match) => [
                'id'         => $match->id,
                'status'     => $match->status,
                'city'       => $match->city?->name_en,
                'workspace'  => $match->workspace?->name,
                'created_at' => $match->created_at,
                'user1' => [
                    'id'    => $match->user1->id,
                    'name'  => $match->user1->name,
                    'email' => $match->user1->email,
                ],
                'user2' => [
                    'id'    => $match->user2->id,
                    'name'  => $match->user2->name,
                    'email' => $match->user2->email,
                ],
            ]),
            'meta' => [
                'current_page' => $matches->currentPage(),
                'last_page'    => $matches->lastPage(),
                'per_page'     => $matches->perPage(),
                'total'        => $matches->total(),
            ],
        ]);
    }
}