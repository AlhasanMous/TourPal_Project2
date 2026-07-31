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
        Schema::create('workspace_timeline_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->date('planned_date');
            $table->time('planned_time')->nullable();
            $table->integer('order_in_day')->default(0);
            $table->enum('item_type', ['place', 'accommodation', 'transport', 'note']);
            // لا FK هنا عن قصد — Polymorphic بدون FK (موثق في Schema)
            // الـ Validation يصير في TimelineService
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('label', 500)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('added_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['workspace_id', 'planned_date', 'order_in_day'], 'idx_timeline_day');
            $table->index(['workspace_id', 'planned_date'], 'idx_timeline_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workspace_timeline_items');
    }
};
