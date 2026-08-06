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
        Schema::create('guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('city_id')->constrained('cities')->restrictOnDelete();
            $table->enum('verification_status', ['pending', 'approved', 'rejected']) ->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->json('specializations')->nullable();
            $table->json('availability')->nullable();
            $table->timestamps();

            $table->index('city_id', 'idx_guides_city');
            $table->index('verification_status', 'idx_guides_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guides');
    }
};
