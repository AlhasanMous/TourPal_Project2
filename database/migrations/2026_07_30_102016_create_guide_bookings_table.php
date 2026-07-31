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
        Schema::create('guide_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tourist_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('guide_id')->constrained('guides')->cascadeOnDelete();
            $table->date('booking_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['pending', 'accepted', 'declined', 'cancelled'])
                  ->default('pending');
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->timestamps();

            $table->index('tourist_user_id', 'idx_guide_book_tourist');
            $table->index('guide_id', 'idx_guide_book_guide');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guide_bookings');
    }
};
