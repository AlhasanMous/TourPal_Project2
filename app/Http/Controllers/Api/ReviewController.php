<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(private ReviewService $reviewService) {}

    // GET /api/reviews?type=place&id=1
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['required', 'in:place,guide,accommodation'],
            'id'   => ['required', 'integer'],
        ]);

        $reviews = $this->reviewService->getForEntity(
            $request->type,
            $request->id
        );

        return response()->json([
            'reviews' => ReviewResource::collection($reviews),
            'meta'    => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'per_page'     => $reviews->perPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    // POST /api/reviews
    public function store(StoreReviewRequest $request): JsonResponse
    {
        try {
            $review = $this->reviewService->create(
                $request->validated(),
                $request->user()->id
            );

            return response()->json([
                'message' => 'تم إضافة تقييمك بنجاح',
                'review'  => new ReviewResource($review),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // DELETE /api/reviews/{review}
    public function destroy(Request $request, Review $review): JsonResponse
    {
        try {
            $this->reviewService->delete($review, $request->user()->id);

            return response()->json([
                'message' => 'تم حذف التقييم بنجاح',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        }
    }
}