<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccommodationRequest extends FormRequest
{
 public function authorize(): bool
{
    return $this->user()->hasRole('admin', 'api');
}
    public function rules(): array
    {
        return [
            'host_user_id' => ['required', 'integer', 'exists:users,id'],
            'name'         => ['required', 'string', 'max:255'],
            'type'         => ['required', 'in:hotel,hostel,shared'],
            'city_id'      => ['required', 'integer', 'exists:cities,id'],
            'capacity'     => ['required', 'integer', 'min:1'],
            'price_range'  => ['nullable', 'string', 'max:50'],
            'image'     => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'required_without:image_url'],
'image_url' => ['nullable', 'url', 'required_without:image'],
        ];
    }

    public function messages(): array
    {
        return [
            'host_user_id.required' => 'المضيف مطلوب',
            'host_user_id.exists'   => 'المستخدم غير موجود',
            'name.required'         => 'اسم الإقامة مطلوب',
            'type.required'         => 'نوع الإقامة مطلوب',
            'type.in'               => 'النوع يجب أن يكون: hotel, hostel, shared',
            'city_id.required'      => 'المدينة مطلوبة',
            'city_id.exists'        => 'المدينة غير موجودة',
            'capacity.required'     => 'السعة مطلوبة',
            'capacity.min'          => 'السعة يجب أن تكون 1 على الأقل',
            'image.image'   => 'الملف يجب أن يكون صورة',
'image.mimes'   => 'صيغة الصورة يجب أن تكون: jpg, jpeg, png, webp',
'image.max'     => 'حجم الصورة يجب أن لا يتجاوز 5MB',
'image_url.url' => 'رابط الصورة غير صالح',
        ];
    }
}