<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Review extends Model
{
    protected $fillable = [
        'reviewer_user_id',
        'reviewable_type',
        'reviewable_id',
        'rating',
        'content',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }

    // Polymorphic — يشير لـ Place أو Guide أو Accommodation
    public function reviewable(): MorphTo
    {
        return $this->morphTo();
    }
}