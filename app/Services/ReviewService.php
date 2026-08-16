<?php

namespace App\Services;

use App\Models\Place;
use App\Models\Guide;
use App\Models\Accommodation;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    // نماذج الـ Polymorphic
    private array $models = [
        'place'         => Place::class,
        'guide'         => Guide::class,
        'accommodation' => Accommodation::class,
    ];

    public function create(array $data, int $userId): Review
    {
        // تحقق إن الـ Entity موجود
        $model = $this->models[$data['reviewable_type']];
        $entity = $model::find($data['reviewable_id']);

        if (!$entity) {
            throw ValidationException::withMessages([
                'reviewable_id' => ['العنصر المحدد غير موجود'],
            ]);
        }

        // تحقق ما راجع مسبقاً
        $exists = Review::where('reviewer_user_id', $userId)
            ->where('reviewable_type', $data['reviewable_type'])
            ->where('reviewable_id', $data['reviewable_id'])
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'reviewable_id' => ['لقد قمت بتقييم هذا العنصر مسبقاً'],
            ]);
        }

        return DB::transaction(function () use ($data, $userId, $entity, $model) {
            $review = Review::create([
                'reviewer_user_id' => $userId,
                'reviewable_type'  => $data['reviewable_type'],
                'reviewable_id'    => $data['reviewable_id'],
                'rating'           => $data['rating'],
                'content'          => $data['content'] ?? null,
            ]);

            // تحديث الـ avg_rating على Place فقط
            if ($data['reviewable_type'] === 'place') {
                $avg = Review::where('reviewable_type', 'place')
                    ->where('reviewable_id', $data['reviewable_id'])
                    ->avg('rating');

                $entity->update(['avg_rating' => round($avg, 2)]);
            }

            return $review->load('reviewer');
        });
    }

    public function delete(Review $review, int $userId): void
    {
        if ($review->reviewer_user_id !== $userId) {
            throw new \Exception('ليس لديك صلاحية لحذف هذا التقييم');
        }

        DB::transaction(function () use ($review) {
            $type = $review->reviewable_type;
            $id   = $review->reviewable_id;

            $review->delete();

            // أعد حساب الـ avg_rating للـ Place
            if ($type === 'place') {
                $avg = Review::where('reviewable_type', 'place')
                    ->where('reviewable_id', $id)
                    ->avg('rating') ?? 0;

                Place::where('id', $id)->update(['avg_rating' => round($avg, 2)]);
            }
        });
    }

    public function getForEntity(string $type, int $id)
    {
        return Review::with('reviewer')
            ->where('reviewable_type', $type)
            ->where('reviewable_id', $id)
            ->latest()
            ->paginate(10);
    }
}