<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccommodationBooking extends Model
{
    protected $fillable = [
        'tourist_user_id',
        'accommodation_id',
        'check_in',
        'check_out',
        'room_type',
        'status',
        'workspace_id',
    ];

    protected function casts(): array
    {
        return [
            'check_in'  => 'date',
            'check_out' => 'date',
        ];
    }

    // Model Event — لما يُحذف الـ Booking، احذف Timeline Items المرتبطة
    protected static function booted(): void
    {
        static::deleting(function (AccommodationBooking $booking) {
            WorkspaceTimelineItem::where('item_type', 'accommodation')
                ->where('reference_id', $booking->id)
                ->delete();
        });
    }

    public function tourist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tourist_user_id');
    }

    public function accommodation(): BelongsTo
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}