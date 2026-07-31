<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideBooking extends Model
{
    protected $fillable = [
        'tourist_user_id',
        'guide_id',
        'booking_date',
        'start_time',
        'end_time',
        'status',
        'workspace_id',
    ];

    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
            'start_time'   => 'string',
            'end_time'     => 'string',
        ];
    }

    public function tourist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tourist_user_id');
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guide::class);
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}