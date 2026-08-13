<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuideBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guide_id'     => ['required', 'integer', 'exists:guides,id'],
            'booking_date' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:today'],
            'start_time'   => ['required', 'date_format:H:i'],
            'end_time'     => ['required', 'date_format:H:i', 'after:start_time'],
            'workspace_id' => ['nullable', 'integer', 'exists:workspaces,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'guide_id.required'          => 'المرشد مطلوب',
            'guide_id.exists'            => 'المرشد غير موجود',
            'booking_date.required'      => 'تاريخ الحجز مطلوب',
            'booking_date.date_format'   => 'تاريخ الحجز يجب أن يكون بصيغة YYYY-MM-DD',
            'booking_date.after_or_equal'=> 'تاريخ الحجز يجب أن يكون اليوم أو بعده',
            'start_time.required'        => 'وقت البداية مطلوب',
            'start_time.date_format'     => 'وقت البداية يجب أن يكون بصيغة HH:MM',
            'end_time.required'          => 'وقت النهاية مطلوب',
            'end_time.date_format'       => 'وقت النهاية يجب أن يكون بصيغة HH:MM',
            'end_time.after'             => 'وقت النهاية يجب أن يكون بعد وقت البداية',
            'workspace_id.exists'        => 'مساحة العمل غير موجودة',
        ];
    }
}