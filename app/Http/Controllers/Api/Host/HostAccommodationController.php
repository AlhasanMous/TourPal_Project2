<?php

namespace App\Http\Controllers\Api\Host;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accommodation\StoreAccommodationRequest;
use App\Http\Requests\Accommodation\UpdateAccommodationRequest;
use App\Http\Resources\AccommodationResource;
use App\Models\Accommodation;
use App\Services\AccommodationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostAccommodationController extends Controller
{
    public function __construct(private AccommodationService $accommodationService) {}

    // GET /api/host/accommodations
    public function index(Request $request): JsonResponse
    {
        $accommodations = $this->accommodationService->getHostAccommodations(
            $request->user()->id
        );

        return response()->json([
            'accommodations' => AccommodationResource::collection($accommodations),
            'meta'           => [
                'current_page' => $accommodations->currentPage(),
                'last_page'    => $accommodations->lastPage(),
                'per_page'     => $accommodations->perPage(),
                'total'        => $accommodations->total(),
            ],
        ]);
    }

    // POST /api/host/accommodations
    public function store(StoreAccommodationRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $accommodation = $this->accommodationService->create(
            $data,
            $request->user()->id
        );

        return response()->json([
            'message'       => 'تم إضافة مكان الإقامة بنجاح، في انتظار موافقة الإدارة',
            'accommodation' => new AccommodationResource($accommodation),
        ], 201);
    }

    // PUT /api/host/accommodations/{accommodation}
    public function update(
        UpdateAccommodationRequest $request,
        Accommodation $accommodation
    ): JsonResponse {
        // تحقق إن الـ Host هو صاحب الـ accommodation
        if ($accommodation->host_user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'ليس لديك صلاحية لتعديل هذا المكان',
            ], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $accommodation = $this->accommodationService->update($accommodation, $data);

        return response()->json([
            'message'       => 'تم تحديث مكان الإقامة بنجاح',
            'accommodation' => new AccommodationResource($accommodation),
        ]);
    }

    // DELETE /api/host/accommodations/{accommodation}
    public function destroy(Request $request, Accommodation $accommodation): JsonResponse
    {
        // — ValidationException بتتعامل معها Laravel تلقائياً
            $this->accommodationService->delete($accommodation, $request->user()->id);
            return response()->json(['message' => 'تم حذف مكان الإقامة بنجاح']);
    }
}