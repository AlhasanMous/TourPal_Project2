<?php

namespace App\Services\Admin;

use App\Models\TransportCompany;
use App\Models\TransportRoute;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AdminTransportService
{
    // ── Companies ──────────────────────────────────────────────────

    public function getAllCompanies(array $filters = []): Collection
    {
        $query = TransportCompany::withCount('routes');

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name_ar', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('name_en', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->latest()->get();
    }

    public function createCompany(array $data): TransportCompany
    {
        return TransportCompany::create($data);
    }

    public function updateCompany(TransportCompany $company, array $data): TransportCompany
    {
        $company->update($data);
        return $company->fresh();
    }

    public function deleteCompany(TransportCompany $company): void
    {
        // لا نحذف الشركة إذا عندها routes
        if ($company->routes()->exists()) {
            throw new \Exception('لا يمكن حذف الشركة لأن لديها مسارات مرتبطة');
        }
        $company->delete();
    }

    // ── Routes ─────────────────────────────────────────────────────

    public function getAllRoutes(array $filters = []): LengthAwarePaginator
    {
        $query = TransportRoute::with(['company', 'originCity', 'destinationCity']);

        if (!empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        if (!empty($filters['origin_city_id'])) {
            $query->where('origin_city_id', $filters['origin_city_id']);
        }

        if (!empty($filters['destination_city_id'])) {
            $query->where('destination_city_id', $filters['destination_city_id']);
        }

        if (!empty($filters['transport_type'])) {
            $query->where('transport_type', $filters['transport_type']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->latest()->paginate(20);
    }

    public function createRoute(array $data): TransportRoute
    {
        return TransportRoute::create($data);
    }

    public function updateRoute(TransportRoute $route, array $data): TransportRoute
    {
        $route->update($data);
        return $route->fresh(['company', 'originCity', 'destinationCity']);
    }

    public function deleteRoute(TransportRoute $route): void
    {
        $route->delete();
    }
}