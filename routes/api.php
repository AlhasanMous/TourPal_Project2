<?php

use App\Http\Controllers\Api\Admin\CityController;
use App\Http\Controllers\Api\Admin\PlaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\WorkspaceParticipantController;
use App\Http\Controllers\Api\Admin\WorkspaceController as AdminWorkspaceController;
use App\Http\Controllers\Api\WorkspacePlaceController;
use App\Http\Controllers\Api\WorkspaceTimelineController;
use App\Http\Controllers\Api\WorkspaceSuggestionController;
use App\Http\Controllers\Api\Admin\UserController;



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
        // Workspace Places
    Route::get('places',            [WorkspacePlaceController::class, 'index']);
    Route::post('places',           [WorkspacePlaceController::class, 'store']);
    Route::delete('places/{place}', [WorkspacePlaceController::class, 'destroy']);
       // Participants
    Route::post('invite',                    [WorkspaceParticipantController::class, 'invite']);
    Route::post('accept',                    [WorkspaceParticipantController::class, 'accept']);
    Route::post('decline',                   [WorkspaceParticipantController::class, 'decline']);
    Route::delete('participants/{userId}',   [WorkspaceParticipantController::class, 'remove']);
});
});
     // workspace timeline
Route::prefix('workspaces/{workspace}/timeline')->group(function () {
    Route::get('/',                                    [WorkspaceTimelineController::class, 'index']);
    Route::post('/',                                   [WorkspaceTimelineController::class, 'store']);
    Route::put('/{item}',                              [WorkspaceTimelineController::class, 'update']);
    Route::delete('/{item}',                           [WorkspaceTimelineController::class, 'destroy']);
    Route::post('/{item}/participants',                [WorkspaceTimelineController::class, 'addParticipant']);
    Route::delete('/{item}/participants/{userId}',     [WorkspaceTimelineController::class, 'removeParticipant']);
});

// Workspace Suggestions
Route::prefix('workspaces/{workspace}/suggestions')->group(function () {
    Route::get('/',                        [WorkspaceSuggestionController::class, 'index']);
    Route::get('/pending',                 [WorkspaceSuggestionController::class, 'pending']);
    Route::post('/',                       [WorkspaceSuggestionController::class, 'store']);
    Route::post('/{suggestion}/respond',   [WorkspaceSuggestionController::class, 'respond']);
});

// ─── Admin only ──────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('cities', CityController::class);
    Route::apiResource('places', PlaceController::class);
     // Users Management
    Route::get('users',                           [UserController::class, 'index']);
    Route::get('users/{user}',                    [UserController::class, 'show']);
    Route::put('users/{user}',                    [UserController::class, 'update']);
    Route::delete('users/{user}',                 [UserController::class, 'destroy']);
    Route::post('users/{id}/restore',             [UserController::class, 'restore']);
    Route::post('users/{user}/toggle-verification',[UserController::class, 'toggleVerification']);

/// Admin Workspaces
    Route::prefix('workspaces')->group(function () {
        Route::get('/',                          [AdminWorkspaceController::class, 'index']);
        Route::get('/{workspace}',               [AdminWorkspaceController::class, 'show']);
        Route::delete('/{workspace}',            [AdminWorkspaceController::class, 'destroy']);
        Route::get('/{workspace}/participants',  [AdminWorkspaceController::class, 'participants']);
        Route::get('/{workspace}/places',        [AdminWorkspaceController::class, 'places']);
        Route::get('/{workspace}/timeline',      [AdminWorkspaceController::class, 'timeline']);
        Route::get('/{workspace}/suggestions',   [AdminWorkspaceController::class, 'suggestions']);
    });
});


