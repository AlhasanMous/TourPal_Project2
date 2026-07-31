<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transport_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('transport_companies')->cascadeOnDelete();
            $table->foreignId('origin_city_id')->constrained('cities')->restrictOnDelete();
            $table->foreignId('destination_city_id')->constrained('cities')->restrictOnDelete();
            $table->enum('transport_type', ['bus', 'taxi', 'minibus', 'train', 'other']); 
            $table->integer('duration_minutes');
            $table->decimal('price_approx', 10, 2)->nullable();
            $table->text('schedule_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(
                ['company_id', 'origin_city_id', 'destination_city_id','transport_type'],
                'unique_route'
            );
            $table->index('origin_city_id', 'idx_routes_origin');
            $table->index('destination_city_id', 'idx_routes_destination');
            $table->index(
                ['origin_city_id', 'destination_city_id'],
                'idx_routes_od'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transport_routes');
    }
};
