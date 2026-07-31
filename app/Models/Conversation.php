<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'participant1_id',
        'participant2_id',
    ];

    public function participant1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant1_id');
    }

    public function participant2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant2_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    // Helper — يرجع الطرف الثاني في المحادثة
    public function getOtherParticipant(int $userId): BelongsTo|User|null
    {
        return $this->participant1_id === $userId
            ? $this->participant2
            : $this->participant1;
    }
}