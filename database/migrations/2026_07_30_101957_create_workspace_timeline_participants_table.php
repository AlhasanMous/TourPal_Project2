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
        Schema::create('workspace_timeline_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('timeline_item_id')
                  ->constrained('workspace_timeline_items')
                  ->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->unique(['timeline_item_id', 'user_id'], 'unique_item_participant');
            $table->index('timeline_item_id', 'idx_tl_participants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workspace_timeline_participants');
    }
};
