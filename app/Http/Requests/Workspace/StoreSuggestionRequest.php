<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class StoreSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => [
                'required',
                'in:add_place,remove_place,reorder,change_hours,add_note,remove_note',
            ],
            'payload'      => ['required', 'array'],
            'note'         => ['nullable', 'string', 'max:1000'],

            // add_place
            'payload.place_id'       => ['required_if:type,add_place', 'integer', 'exists:places,id'],
            'payload.planned_date'   => ['required_if:type,add_place', 'date_format:Y-m-d'],
            'payload.planned_time'   => ['nullable', 'date_format:H:i'],
            'payload.order_in_day'   => ['nullable', 'integer', 'min:0'],

            // remove_place / reorder / change_hours / remove_note
            'payload.timeline_item_id' => [
                'required_if:type,remove_place',
                'required_if:type,reorder',
                'required_if:type,change_hours',
                'required_if:type,remove_note',
                'integer',
                'exists:workspace_timeline_items,id',
            ],

            // add_note
            'payload.label' => ['required_if:type,add_note', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required'                    => 'نوع الاقتراح مطلوب',
            'type.in'                          => 'نوع الاقتراح غير صحيح',
            'payload.required'                 => 'تفاصيل الاقتراح مطلوبة',
            'payload.place_id.required_if'     => 'المكان مطلوب عند اقتراح إضافة مكان',
            'payload.place_id.exists'          => 'المكان غير موجود',
            'payload.planned_date.required_if' => 'التاريخ مطلوب',
            'payload.timeline_item_id.required_if' => 'معرّف النشاط مطلوب',
            'payload.timeline_item_id.exists'  => 'النشاط غير موجود في الجدول الزمني',
            'payload.label.required_if'        => 'نص الملاحظة مطلوب',
        ];
    }
}