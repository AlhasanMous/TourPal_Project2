<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceTimelineParticipant extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'timeline_item_id',
        'user_id',
    ];

    public function timelineItem(): BelongsTo
    {
        return $this->belongsTo(WorkspaceTimelineItem::class, 'timeline_item_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}