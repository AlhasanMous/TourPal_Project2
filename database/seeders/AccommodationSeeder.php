<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Accommodation;
use App\Models\City;
use App\Models\Image;
use App\Models\User;

class AccommodationSeeder extends Seeder
{
    private string $base = 'https://images.unsplash.com';

    public function run(): void
    {
        $cities = City::query()->get();

        $hosts = User::role('host')->get();
        if ($hosts->isEmpty()) {
            $hosts = User::query()->limit(10)->get();
            foreach ($hosts as $host) {
                if (!$host->hasRole('host')) {
                    $host->assignRole('host');
                }
            }
        }

        if ($hosts->isEmpty()) {
            $this->command->warn('⚠️ No users found — run UsersSeeder first');
            return;
        }

        $items = [
            ['name' => 'Damascus Guest House', 'city' => 'Damascus', 'type' => 'shared', 'capacity' => 4, 'price_range' => '2500-4000', 'photos' => ['photo-1512970648279-ff3398568f77', 'photo-1562457141-8c1df886f92c']],
            ['name' => 'Aleppo Old House', 'city' => 'Aleppo', 'type' => 'hostel', 'capacity' => 6, 'price_range' => '3000-5000', 'photos' => ['photo-1603584248503-6d14a8ae65f9', 'photo-1700387501742-af20ad30aa8c']],
            ['name' => 'Latakia Beach Studio', 'city' => 'Latakia', 'type' => 'hotel', 'capacity' => 2, 'price_range' => '2000-3500', 'photos' => ['photo-1507525428034-b723cf961d3e', 'photo-1519046904884-53103b34b206']],
            ['name' => 'Homs Central Loft', 'city' => 'Homs', 'type' => 'shared', 'capacity' => 5, 'price_range' => '3000-5500', 'photos' => ['photo-1494526585095-c41746248156', 'photo-1484154218962-a197022b5858']],
            ['name' => 'Old City Courtyard', 'city' => 'Damascus', 'type' => 'hotel', 'capacity' => 8, 'price_range' => '3500-6500', 'photos' => ['photo-1505693416388-ac5ce068fe85', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Al-Madina Family Stay', 'city' => 'Aleppo', 'type' => 'shared', 'capacity' => 7, 'price_range' => '4000-7000', 'photos' => ['photo-1522708323590-d24dbb6b0267', 'photo-1524758631624-e2822e304c36']],
            ['name' => 'Seaside View Suite', 'city' => 'Latakia', 'type' => 'hotel', 'capacity' => 3, 'price_range' => '4500-8000', 'photos' => ['photo-1445019980597-93fa8acb246c', 'photo-1502672260266-1c1ef2d93688']],
            ['name' => 'Homs Garden Home', 'city' => 'Homs', 'type' => 'shared', 'capacity' => 10, 'price_range' => '5000-9000', 'photos' => ['photo-1505693416388-ac5ce068fe85', 'photo-1460317442991-0ec209397118']],
            ['name' => 'Sunset Terrace Rooms', 'city' => 'Damascus', 'type' => 'hostel', 'capacity' => 5, 'price_range' => '2800-5000', 'photos' => ['photo-1520250497591-112f2f40a3f4', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Heritage House Aleppo', 'city' => 'Aleppo', 'type' => 'hotel', 'capacity' => 6, 'price_range' => '3200-5800', 'photos' => ['photo-1494526585095-c41746248156', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Coastal Rooms Latakia', 'city' => 'Latakia', 'type' => 'hostel', 'capacity' => 4, 'price_range' => '2600-4300', 'photos' => ['photo-1502672260266-1c1ef2d93688', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Stone House Homs', 'city' => 'Homs', 'type' => 'shared', 'capacity' => 6, 'price_range' => '3300-6200', 'photos' => ['photo-1522708323590-d24dbb6b0267', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Syria Hills Stay', 'city' => 'Damascus', 'type' => 'hotel', 'capacity' => 12, 'price_range' => '7000-12000', 'photos' => ['photo-1460317442991-0ec209397118', 'photo-1494526585095-c41746248156']],
            ['name' => 'Citadel View Rooms', 'city' => 'Aleppo', 'type' => 'shared', 'capacity' => 4, 'price_range' => '3500-6000', 'photos' => ['photo-1484154218962-a197022b5858', 'photo-1524758631624-e2822e304c36']],
            ['name' => 'Blue Harbor Place', 'city' => 'Latakia', 'type' => 'hotel', 'capacity' => 2, 'price_range' => '2500-5000', 'photos' => ['photo-1445019980597-93fa8acb246c', 'photo-1520250497591-112f2f40a3f4']],
            ['name' => 'Homs Riverside Rooms', 'city' => 'Homs', 'type' => 'shared', 'capacity' => 3, 'price_range' => '4200-6800', 'photos' => ['photo-1505693416388-ac5ce068fe85', 'photo-1522708323590-d24dbb6b0267']],
            ['name' => 'City Light Rooms', 'city' => 'Damascus', 'type' => 'shared', 'capacity' => 5, 'price_range' => '2900-5200', 'photos' => ['photo-1512917774080-9991f1c4c750', 'photo-1556911220-bff31c812dba']],
            ['name' => 'Aleppo Silk House', 'city' => 'Aleppo', 'type' => 'hotel', 'capacity' => 8, 'price_range' => '3800-7000', 'photos' => ['photo-1494526585095-c41746248156', 'photo-1524758631624-e2822e304c36']],
            ['name' => 'Palm Beach Residence', 'city' => 'Latakia', 'type' => 'shared', 'capacity' => 6, 'price_range' => '4300-7600', 'photos' => ['photo-1502672260266-1c1ef2d93688', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Homs Family Villa', 'city' => 'Homs', 'type' => 'hotel', 'capacity' => 9, 'price_range' => '5500-9800', 'photos' => ['photo-1460317442991-0ec209397118', 'photo-1494526585095-c41746248156']],
            ['name' => 'Damascus Rose Stay', 'city' => 'Damascus', 'type' => 'hotel', 'capacity' => 3, 'price_range' => '3200-5600', 'photos' => ['photo-1505693416388-ac5ce068fe85', 'photo-1556911220-bff31c812dba']],
            ['name' => 'Barrel House Aleppo', 'city' => 'Aleppo', 'type' => 'hostel', 'capacity' => 5, 'price_range' => '3100-5400', 'photos' => ['photo-1505693416388-ac5ce068fe85', 'photo-1484154218962-a197022b5858']],
            ['name' => 'Al-Hamam Guest Rooms', 'city' => 'Latakia', 'type' => 'hostel', 'capacity' => 7, 'price_range' => '3000-5200', 'photos' => ['photo-1502672260266-1c1ef2d93688', 'photo-1520250497591-112f2f40a3f4']],
            ['name' => 'Nour House Homs', 'city' => 'Homs', 'type' => 'shared', 'capacity' => 6, 'price_range' => '3600-6200', 'photos' => ['photo-1522708323590-d24dbb6b0267', 'photo-1505693416388-ac5ce068fe85']],
            ['name' => 'Ancient City Retreat', 'city' => 'Damascus', 'type' => 'hotel', 'capacity' => 2, 'price_range' => '4000-6800', 'photos' => ['photo-1494526585095-c41746248156', 'photo-1556911220-bff31c812dba']],
            ['name' => 'Golden Hour Loft', 'city' => 'Aleppo', 'type' => 'shared', 'capacity' => 4, 'price_range' => '3400-6100', 'photos' => ['photo-1524758631624-e2822e304c36', 'photo-1484154218962-a197022b5858']],
            ['name' => 'Mediterranean Nest', 'city' => 'Latakia', 'type' => 'hotel', 'capacity' => 3, 'price_range' => '4100-7200', 'photos' => ['photo-1445019980597-93fa8acb246c', 'photo-1502672260266-1c1ef2d93688']],
        ];

        foreach ($items as $index => $data) {
            $city = $cities->firstWhere('name_en', $data['city']) ?? $cities->first();
            if (!$city) {
                $this->command->warn("⚠️ City not found: {$data['city']} — skipping {$data['name']}");
                continue;
            }

            $host = $hosts[$index % $hosts->count()];
            $status = $index < 10 ? 'pending' : ($index < 18 ? 'approved' : 'rejected');

            $acc = Accommodation::updateOrCreate(
                ['name' => $data['name'], 'host_user_id' => $host->id],
                [
                    'type' => $data['type'],
                    'city_id' => $city->id,
                    'capacity' => $data['capacity'],
                    'price_range' => $data['price_range'],
                    'verification_status' => $status,
                    'verified_at' => $status === 'approved' ? now()->subDays(rand(1, 20)) : null,
                    'rejection_reason' => $status === 'rejected' ? 'Incomplete property details.' : null,
                ]
            );

            foreach ($data['photos'] as $idx => $photoId) {
                Image::updateOrCreate(
                    [
                        'imageable_type' => Accommodation::class,
                        'imageable_id' => $acc->id,
                        'image_url' => $this->buildUrl($photoId),
                    ],
                    [
                        'is_main' => $idx === 0,
                        'sort_order' => $idx + 1,
                    ]
                );
            }

            $this->command->info("✅ Accommodation seeded: {$data['name']} [{$status}]");
        }

        $total = Accommodation::count();
        $pending = Accommodation::where('verification_status', 'pending')->count();

        $this->command->info("🎉 AccommodationSeeder completed — total: {$total}, pending: {$pending}");
    }

    private function buildUrl(string $photoId): string
    {
        return "{$this->base}/{$photoId}?w=800&auto=format&fit=crop&q=80";
    }
}
