<?php

use App\Http\Controllers\Api\Admin\CityController;
use App\Http\Controllers\Api\Admin\PlaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\WorkspaceParticipantController;
use App\Http\Controllers\Api\Admin\WorkspaceController as AdminWorkspaceController;
// ─── Public Auth ─────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
  
});

// ─── Public: عرض المدن والأماكن ─────────────────────────
Route::get('cities',         [CityController::class,  'index']);
Route::get('cities/{city}', [CityController::class, 'show']);
Route::get('places',         [PlaceController::class, 'index']);
Route::get('places/{place}', [PlaceController::class, 'show']);

// ─── Protected ───────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);
    Route::apiResource('workspaces', WorkspaceController::class);
    // Workspace Participants
    Route::prefix('workspaces/{workspace}')->group(function () {
    Route::post('invite',                    [WorkspaceParticipantController::class, 'invite']);
    Route::post('accept',                    [WorkspaceParticipantController::class, 'accept']);
    Route::post('decline',                   [WorkspaceParticipantController::class, 'decline']);
    Route::delete('participants/{userId}',   [WorkspaceParticipantController::class, 'remove']);
});
});

// ─── Admin only ──────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('cities', CityController::class);
    Route::apiResource('places', PlaceController::class);
// Workspaces — للادمن (عرض + حذف فقط)
    Route::get('workspaces',                [AdminWorkspaceController::class, 'index']);
    Route::get('workspaces/{workspace}',    [AdminWorkspaceController::class, 'show']);
    Route::delete('workspaces/{workspace}', [AdminWorkspaceController::class, 'destroy']);
});
