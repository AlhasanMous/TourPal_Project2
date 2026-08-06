<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
class Image extends Model
{
    //
    protected $fillable = [
        'imageable_type',
        'imageable_id',
        'image_url',
        'is_main',
        'sort_order',
    ];
  protected function casts(): array
    {
        return [
            'is_main'    => 'boolean',
            'sort_order' => 'integer',
        ];
    }
      public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}
