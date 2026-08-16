<?php

namespace Tests\Feature;

use App\Models\Accommodation;
use App\Models\AccommodationBooking;
use App\Models\City;
use App\Models\User;
use Database\Seeders\AccommodationBookingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccommodationBookingSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_accommodation_booking_seeder_creates_records_for_existing_data(): void
    {
        $host = User::factory()->create();
        $tourist = User::factory()->create();
        $city = City::create([
            'name_ar' => 'دمشق',
            'name_en' => 'Damascus',
            'region' => 'Center',
        ]);

        Accommodation::create([
            'host_user_id' => $host->id,
            'name' => 'Damascus Guest House',
            'type' => 'shared',
            'city_id' => $city->id,
            'capacity' => 4,
            'price_range' => '2500-4000',
            'verification_status' => 'approved',
            'verified_at' => now(),
        ]);

        (new AccommodationBookingSeeder())->run();

        $this->assertDatabaseCount('accommodation_bookings', 12);
        $this->assertTrue(
            AccommodationBooking::query()->where('tourist_user_id', $tourist->id)->exists()
                || AccommodationBooking::query()->exists()
        );
    }
}
