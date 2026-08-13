<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimelineItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'planned_date' => ['required', 'date', 'date_format:Y-m-d'],
            'planned_time' => ['nullable', 'date_format:H:i'],
            'order_in_day' => ['nullable', 'integer', 'min:0'],

            'item_type'    => ['required', 'in:place,accommodation,transport,note'],

            // مطلوب لكل شي ما عدا note
            //'reference_id' => ['required_if:item_type,place,accommodation,transport', 'nullable', 'integer', 'min:1'],
            // بعد ✅ — required ما لم يكون note
            'reference_id' => ['required_unless:item_type,note', 'nullable', 'integer', 'min:1'],
            'label'        => ['nullable', 'string', 'max:500'],
            'notes'        => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'planned_date.required'    => 'تاريخ النشاط مطلوب',
            'planned_date.date'        => 'تاريخ النشاط غير صحيح',
            'planned_date.date_format' => 'تاريخ النشاط يجب أن يكون بصيغة YYYY-MM-DD',
            'planned_time.date_format' => 'وقت النشاط يجب أن يكون بصيغة HH:MM',
            'order_in_day.integer'     => 'الترتيب يجب أن يكون رقماً صحيحاً',
            'order_in_day.min'         => 'الترتيب يجب أن يكون 0 أو أكثر',
            'item_type.required'       => 'نوع النشاط مطلوب',
            'item_type.in'             => 'نوع النشاط يجب أن يكون: place, accommodation, transport, note',
            'reference_id.required_if' => 'معرّف العنصر مطلوب عند اختيار place أو accommodation أو transport',
            'reference_id.integer'     => 'معرّف العنصر يجب أن يكون رقماً صحيحاً',
            'reference_id.min'         => 'معرّف العنصر غير صحيح',
            'label.max'                => 'العنوان يجب أن لا يتجاوز 500 حرف',
            'notes.max'                => 'الملاحظات يجب أن لا تتجاوز 2000 حرف',
        ];
    }
}
