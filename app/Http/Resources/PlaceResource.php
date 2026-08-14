<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'name_ar'              => $this->name_ar,
            'name_en'              => $this->name_en,
            'description_ar'       => $this->description_ar,
            'description_en'       => $this->description_en,
            'category'             => $this->category,







            //افضل طريقة لتخزين واسترجاع الصور من خلال رابط الصورة او من خلال التخزين المحلي
            'main_image' => $this->whenLoaded('images', function () {

                $image = $this->images
                    ->where('is_main', true)
                    ->first();

                if (!$image) {
                    return null;
                }

                return $this->imageUrl($image->image_url);
            }),


            'images' => $this->whenLoaded('images', function () {

                return $this->images->map(function ($img) {

                    return [
                        'url' => $this->imageUrl($img->image_url),

                        'is_main' => $img->is_main,
                        'sort_order' => $img->sort_order,
                    ];
                });
            }),


            'avg_rating'           => $this->avg_rating,
            'visit_duration_hours' => $this->visit_duration_hours,
            'opening_hours'        => $this->opening_hours,
            'city'                 => new CityResource($this->whenLoaded('city')),
            'created_at'           => $this->created_at,
        ];
    }

    //تابع يقوم بتحويل رابط الصورة الى رابط كامل سواء كان رابط خارجي او رابط من التخزين المحلي
    private function imageUrl($url)
    {
        if (!$url) {
            return null;
        }

        // روابط الانترنت مثل unsplash
        if (str_starts_with($url, 'http')) {
            return $url;
        }

        // صور التخزين المحلي
        return asset($url);
    }
}
