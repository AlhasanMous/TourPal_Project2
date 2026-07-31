<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewer_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('reviewable_type'); // 'place' | 'guide' | 'accommodation'
            $table->unsignedBigInteger('reviewable_id');
            $table->unsignedTinyInteger('rating');
            $table->text('content')->nullable();
            $table->timestamps();

            $table->unique(
                ['reviewer_user_id', 'reviewable_type', 'reviewable_id'],
                'unique_review'
            );
            $table->index(['reviewable_type', 'reviewable_id'], 'idx_reviewable');
        });

        DB::statement('ALTER TABLE reviews ADD CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)');
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
