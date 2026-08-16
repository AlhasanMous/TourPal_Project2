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
        $cities = City::whereIn('name_en', ['Damascus', 'Aleppo', 'Latakia', 'Homs'])->get()->keyBy('name_en');

        $host = User::first();
        if (!$host) {
            $this->command->warn('⚠️ No users found — run UsersSeeder first');
            return;
        }

        $items = [
            'Damascus Guest House' => [
                'city' => 'Damascus',
                'type' => 'shared',
                'capacity' => 4,
                'price_range' => '2500-4000',
                'photos' => [
                    'photo-1512970648279-ff3398568f77',
                    'photo-1562457141-8c1df886f92c',
                ],
            ],
            'Aleppo Old House' => [
                'city' => 'Aleppo',
                'type' => 'hostel',
                'capacity' => 6,
                'price_range' => '3000-5000',
                'photos' => [
                    'photo-1603584248503-6d14a8ae65f9',
                    'photo-1700387501742-af20ad30aa8c',
                ],
            ],
            'Latakia Beach Studio' => [
                'city' => 'Latakia',
                'type' => 'hotel',
                'capacity' => 2,
                'price_range' => '2000-3500',
                'photos' => [
                    'photo-1507525428034-b723cf961d3e',
                    'photo-1519046904884-53103b34b206',
                ],
            ],
        ];

        foreach ($items as $name => $data) {
            $city = $cities[$data['city']] ?? null;
            if (!$city) {
                $this->command->warn("⚠️ City not found: {$data['city']} — skipping {$name}");
                continue;
            }

            $acc = Accommodation::firstOrCreate(
                ['name' => $name, 'host_user_id' => $host->id],
                [
                    'type' => $data['type'],
                    'city_id' => $city->id,
                    'capacity' => $data['capacity'],
                    'price_range' => $data['price_range'],
                    'verification_status' => 'approved',
                    'verified_at' => now(),
                ]
            );

            // attach images
            foreach ($data['photos'] as $idx => $photoId) {
                Image::firstOrCreate(
                    [
                        'imageable_type' => Accommodation::class,
                        'imageable_id'   => $acc->id,
                        'image_url'      => $this->buildUrl($photoId),
                    ],
                    [
                        'is_main'    => $idx === 0,
                        'sort_order' => $idx + 1,
                    ]
                );
            }

            $this->command->info("✅ Accommodation seeded: {$name}");
        }

        $this->command->info('🎉 AccommodationSeeder completed');
    }

    private function buildUrl(string $photoId): string
    {
        return "{$this->base}/{$photoId}?w=800&auto=format&fit=crop&q=80";
    }
}
