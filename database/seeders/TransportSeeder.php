<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransportCompany;
use App\Models\TransportRoute;
use App\Models\City;

class TransportSeeder extends Seeder
{
    public function run(): void
    {
        // جلب المدن
        $damascus  = City::where('name_en', 'Damascus')->first();
        $homs      = City::where('name_en', 'Homs')->first();
        $latakia   = City::where('name_en', 'Latakia')->first();
        $aleppo    = City::where('name_en', 'Aleppo')->first();

        if (!$damascus) {
            $this->command->warn('⚠️ No cities found — run CitySeeder first');
            return;
        }

        // ─── شركات النقل ───────────────────────────────────
        $qadmous = TransportCompany::firstOrCreate(
            ['name_en' => 'Al-Qadmous'],
            [
                'name_ar'   => 'القدموس',
                'phone'     => '+963-11-1234567',
                'is_active' => true,
            ]
        );

        $hassan = TransportCompany::firstOrCreate(
            ['name_en' => 'Al-Hassan'],
            [
                'name_ar'   => 'الحسن',
                'phone'     => '+963-11-7654321',
                'is_active' => true,
            ]
        );

        // ─── المسارات ──────────────────────────────────────
        $routes = [];

        if ($homs) {
            $routes[] = [
                'company_id'          => $qadmous->id,
                'origin_city_id'      => $damascus->id,
                'destination_city_id' => $homs->id,
                'transport_type'      => 'bus',
                'duration_minutes'    => 180,
                'price_approx'        => 5000,
                'schedule_notes'      => '06:00، 08:00، 10:00، 14:00، 18:00',
                'is_active'           => true,
            ];
            // عكسي
            $routes[] = [
                'company_id'          => $qadmous->id,
                'origin_city_id'      => $homs->id,
                'destination_city_id' => $damascus->id,
                'transport_type'      => 'bus',
                'duration_minutes'    => 180,
                'price_approx'        => 5000,
                'schedule_notes'      => '07:00، 09:00، 11:00، 15:00، 19:00',
                'is_active'           => true,
            ];
        }

        if ($latakia) {
            $routes[] = [
                'company_id'          => $hassan->id,
                'origin_city_id'      => $damascus->id,
                'destination_city_id' => $latakia->id,
                'transport_type'      => 'bus',
                'duration_minutes'    => 300,
                'price_approx'        => 8000,
                'schedule_notes'      => '07:00، 15:00',
                'is_active'           => true,
            ];
            $routes[] = [
                'company_id'          => $hassan->id,
                'origin_city_id'      => $latakia->id,
                'destination_city_id' => $damascus->id,
                'transport_type'      => 'bus',
                'duration_minutes'    => 300,
                'price_approx'        => 8000,
                'schedule_notes'      => '08:00، 16:00',
                'is_active'           => true,
            ];
        }

        if ($aleppo) {
            $routes[] = [
                'company_id'          => $qadmous->id,
                'origin_city_id'      => $damascus->id,
                'destination_city_id' => $aleppo->id,
                'transport_type'      => 'bus',
                'duration_minutes'    => 240,
                'price_approx'        => 7000,
                'schedule_notes'      => '08:00، 12:00، 20:00',
                'is_active'           => true,
            ];
            $routes[] = [
                'company_id'          => $qadmous->id,
                'origin_city_id'      => $aleppo->id,
                'destination_city_id' => $damascus->id,
                'transport_type'      => 'bus',
                'duration_minutes'    => 240,
                'price_approx'        => 7000,
                'schedule_notes'      => '09:00، 13:00، 21:00',
                'is_active'           => true,
            ];
        }

        foreach ($routes as $route) {
            TransportRoute::firstOrCreate(
                [
                    'company_id'          => $route['company_id'],
                    'origin_city_id'      => $route['origin_city_id'],
                    'destination_city_id' => $route['destination_city_id'],
                    'transport_type'      => $route['transport_type'],
                ],
                $route
            );
        }

        $this->command->info('✅ Transport companies and routes seeded');
    }
}