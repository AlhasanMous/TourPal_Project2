<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TouristMatch extends Model
{
    protected $fillable = [
        'user1_id',
        'user2_id',
        'match_city_id',
        'workspace_id',
        'status',
    ];

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user1_id');
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user2_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'match_city_id');
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    // Helper — يرجع الطرف الثاني في الـ Match
    public function getOtherUser(int $userId): User|null
    {
        return $this->user1_id === $userId
            ? $this->user2
            : $this->user1;
    }
}