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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant1_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('participant2_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            // participant1_id < participant2_id دائماً — يُفرض في app layer
            $table->unique(['participant1_id', 'participant2_id'], 'unique_conversation');
            $table->index(['participant1_id', 'participant2_id'], 'idx_conv_participants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
