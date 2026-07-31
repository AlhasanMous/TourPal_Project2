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
        Schema::create('accommodation_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tourist_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('accommodation_id')->constrained('accommodations')->cascadeOnDelete();
            $table->date('check_in');
            $table->date('check_out');
            $table->string('room_type')->nullable();
            $table->enum('status', ['pending', 'accepted', 'declined', 'cancelled'])
                  ->default('pending');
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->timestamps();

            // التحقق من تداخل التواريخ يصير في AccommodationBookingService
            $table->index('tourist_user_id', 'idx_acc_book_tourist');
            $table->index('accommodation_id', 'idx_acc_book_acc');
            $table->index(
                ['accommodation_id', 'check_in', 'check_out', 'status'],
                'idx_acc_book_overlap'
            );
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accommodation_bookings');
    }
};
