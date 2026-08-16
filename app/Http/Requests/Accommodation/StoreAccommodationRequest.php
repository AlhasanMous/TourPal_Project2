<?php

namespace App\Http\Requests\Accommodation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccommodationRequest extends FormRequest
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
            // 'host_user_id' => ['required', 'integer', 'exists:users,id'],
            'name'        => [
                'required',
                'string',
                'max:255',
                Rule::unique('accommodations', 'name')->ignore($accommodationId),
            ],
            'type'        => ['required', 'in:hotel,hostel,shared'],
            'city_id'     => ['required', 'exists:cities,id'],
            'capacity'    => ['required', 'integer', 'min:1'],
            'price_range' => ['nullable', 'string', 'max:50'],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
                'required_without:image_url',
            ],
            'image_url' => [
                'nullable',
                'url',
                'required_without:image',
            ],
        ];
    }

public function messages(): array
{
    return [
        'name.required'              => 'اسم مكان الإقامة مطلوب',
        'name.unique'                => 'هذا الاسم مستخدم مسبقاً',
        'type.required'              => 'نوع مكان الإقامة مطلوب',
        'type.in'                    => 'النوع يجب أن يكون: hotel, hostel, shared',
        'city_id.required'           => 'المدينة مطلوبة',
        'city_id.exists'             => 'المدينة غير موجودة',
        'capacity.required'          => 'السعة مطلوبة',
        'capacity.min'               => 'السعة يجب أن تكون 1 على الأقل',
        'image.image'                => 'الملف يجب أن يكون صورة',
        'image.mimes'                => 'صيغة الصورة يجب أن تكون: jpg, jpeg, png, webp',
        'image.max'                  => 'حجم الصورة يجب أن لا يتجاوز 5MB',
        'image_url.url'              => 'رابط الصورة غير صالح',
        'image.required_without'     => 'الصورة مطلوبة إذا لم يتم إدخال رابط', // ← أضف
        'image_url.required_without' => 'رابط الصورة مطلوب إذا لم يتم رفع صورة', // ← أضف
    ];
}
}