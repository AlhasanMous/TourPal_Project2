<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceSuggestion extends Model
{
    protected $fillable = [
        'workspace_id',
        'suggester_user_id',
        'type',
        'payload',
        'note',
        'status',
        'responded_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'payload'      => 'array',
            'responded_at' => 'datetime',
        ];
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function suggester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'suggester_user_id');
    }
}