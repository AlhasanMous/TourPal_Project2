<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlaceResource;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // GET /api/wishlist
    public function index(Request $request): JsonResponse
    {
        $wishlists = Wishlist::where('user_id', $request->user()->id)
            ->with(['place.city', 'place.images'])
            ->latest('added_at')
            ->paginate(15);

        return response()->json([
            'wishlist' => $wishlists->map(fn($w) => [
                'wishlist_id' => $w->id,
                'added_at'   => $w->added_at,
                'place'      => new PlaceResource($w->place),
            ]),
            'meta' => [
                'current_page' => $wishlists->currentPage(),
                'last_page'    => $wishlists->lastPage(),
                'per_page'     => $wishlists->perPage(),
                'total'        => $wishlists->total(),
            ],
        ]);
    }

    // POST /api/wishlist
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'place_id' => ['required', 'integer', 'exists:places,id'],
        ], [
            'place_id.required' => 'المكان مطلوب',
            'place_id.exists'   => 'المكان غير موجود',
        ]);

        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('place_id', $request->place_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'هذا المكان موجود مسبقاً في قائمة أمنياتك',
            ], 422);
        }

        Wishlist::create([
            'user_id'  => $request->user()->id,
            'place_id' => $request->place_id,
        ]);

        return response()->json([
            'message' => 'تمت إضافة المكان لقائمة أمنياتك',
        ], 201);
    }

    // DELETE /api/wishlist/{place}
    public function destroy(Request $request, int $placeId): JsonResponse
    {
        $deleted = Wishlist::where('user_id', $request->user()->id)
            ->where('place_id', $placeId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'message' => 'المكان غير موجود في قائمة أمنياتك',
            ], 404);
        }

        return response()->json([
            'message' => 'تمت إزالة المكان من قائمة أمنياتك',
        ]);
    }
}