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
        Schema::create('workspace_suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->foreignId('suggester_user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('type', [
                'add_place',
                'remove_place',
                'reorder',
                'change_hours',
                'add_note',
                'remove_note',
            ]);
            $table->json('payload');
            $table->text('note')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamp('responded_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->index(['workspace_id', 'status'], 'idx_suggestions_workspace_status');
            $table->index(['suggester_user_id', 'status'], 'idx_suggestions_suggester');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workspace_suggestions');
    }
};
