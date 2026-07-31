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
        Schema::create('tourist_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user1_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user2_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('match_city_id')->constrained('cities')->cascadeOnDelete();
            $table->foreignId('workspace_id')->nullable()->constrained('workspaces')->nullOnDelete();
            $table->enum('status', ['pending', 'connected', 'declined'])->default('pending');
            $table->timestamps();

            // user1_id < user2_id دائماً — يُفرض في app layer
            $table->unique(['user1_id', 'user2_id', 'match_city_id'], 'unique_match_pair');
            $table->index('match_city_id', 'idx_matches_city');
            $table->index('workspace_id', 'idx_matches_workspace');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourist_matches');
    }
};
