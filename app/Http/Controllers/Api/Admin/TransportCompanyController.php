<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTransportCompanyRequest;
use App\Http\Resources\TransportCompanyResource;
use App\Models\TransportCompany;
use App\Services\Admin\AdminTransportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportCompanyController extends Controller
{
    public function __construct(private AdminTransportService $transportService) {}

    // GET /api/admin/transport/companies
    public function index(Request $request): JsonResponse
    {
        $companies = $this->transportService->getAllCompanies($request->only([
            'search', 'is_active',
        ]));

        return response()->json([
            'companies' => TransportCompanyResource::collection($companies),
        ]);
    }

    // POST /api/admin/transport/companies
    public function store(StoreTransportCompanyRequest $request): JsonResponse
    {
        $company = $this->transportService->createCompany($request->validated());

        return response()->json([
            'message' => 'تم إضافة شركة النقل بنجاح',
            'company' => new TransportCompanyResource($company),
        ], 201);
    }

    // PUT /api/admin/transport/companies/{company}
    public function update(StoreTransportCompanyRequest $request, TransportCompany $company): JsonResponse
    {
        $company = $this->transportService->updateCompany($company, $request->validated());

        return response()->json([
            'message' => 'تم تحديث شركة النقل بنجاح',
            'company' => new TransportCompanyResource($company),
        ]);
    }

    // DELETE /api/admin/transport/companies/{company}
    public function destroy(TransportCompany $company): JsonResponse
    {
        try {
            $this->transportService->deleteCompany($company);

            return response()->json([
                'message' => 'تم حذف شركة النقل بنجاح',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}