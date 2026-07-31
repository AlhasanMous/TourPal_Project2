<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkspaceTimelineItem extends Model
{
    protected $fillable = [
        'workspace_id',
        'planned_date',
        'planned_time',
        'order_in_day',
        'item_type',
        'reference_id',
        'label',
        'notes',
        'added_by',
    ];

    protected function casts(): array
    {
        return [
            'planned_date' => 'date',
            'planned_time' => 'string',
            'order_in_day' => 'integer',
        ];
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(WorkspaceTimelineParticipant::class, 'timeline_item_id');
    }

    // Polymorphic-style helper — يرجع الـ Entity المرتبط حسب item_type
    public function getReferenceEntity(): Model|null
    {
        return match($this->item_type) {
            'place'         => Place::find($this->reference_id),
            'accommodation' => AccommodationBooking::find($this->reference_id),
            'transport'     => TransportRoute::find($this->reference_id),
            default         => null,
        };
    }
}