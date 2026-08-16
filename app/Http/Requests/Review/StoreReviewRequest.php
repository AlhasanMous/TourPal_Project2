<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reviewable_type' => ['required', 'in:place,guide,accommodation'],
            'reviewable_id'   => ['required', 'integer', 'min:1'],
            'rating'          => ['required', 'integer', 'min:1', 'max:5'],
            'content'         => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reviewable_type.required' => 'نوع العنصر مطلوب',
            'reviewable_type.in'       => 'النوع يجب أن يكون: place, guide, accommodation',
            'reviewable_id.required'   => 'معرّف العنصر مطلوب',
            'rating.required'          => 'التقييم مطلوب',
            'rating.min'               => 'التقييم يجب أن يكون بين 1 و 5',
            'rating.max'               => 'التقييم يجب أن يكون بين 1 و 5',
        ];
    }
}