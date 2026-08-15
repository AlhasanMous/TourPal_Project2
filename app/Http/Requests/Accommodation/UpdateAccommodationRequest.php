<?php

namespace App\Http\Requests\Accommodation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAccommodationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $accommodationId = $this->route('accommodation') instanceof \App\Models\Accommodation
            ? $this->route('accommodation')->id
            : $this->route('accommodation');

        return [
            'name'        => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('accommodations', 'name')->ignore($accommodationId),
            ],
            'type'        => ['sometimes', 'in:hotel,hostel,shared'],
            'city_id'     => ['sometimes', 'exists:cities,id'],
            'capacity'    => ['sometimes', 'integer', 'min:1'],
            'price_range' => ['nullable', 'string', 'max:50'],
            'image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'image_url'   => ['nullable', 'url'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique'   => 'هذا الاسم مستخدم مسبقاً',
            'type.in'       => 'النوع يجب أن يكون: hotel, hostel, shared',
            'city_id.exists'=> 'المدينة غير موجودة',
            'capacity.min'  => 'السعة يجب أن تكون 1 على الأقل',
            'image.image'   => 'الملف يجب أن يكون صورة',
            'image_url.url' => 'رابط الصورة غير صالح',
        ];
    }
}