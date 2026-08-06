<?php

use App\Http\Controllers\Api\Admin\CityController;
use App\Http\Controllers\Api\Admin\PlaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkspaceController;

// ─── Public Auth ─────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::apiResource('workspaces', WorkspaceController::class);
});

// ─── Public: عرض المدن والأماكن ─────────────────────────
Route::get('cities',         [CityController::class,  'index']);
Route::get('places',         [PlaceController::class, 'index']);
Route::get('places/{place}', [PlaceController::class, 'show']);

// ─── Protected ───────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);
});

// ─── Admin only ──────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('cities', CityController::class);
    Route::apiResource('places', PlaceController::class);
});