<?php

use App\Http\Controllers\Api\Admin\CityController;
use App\Http\Controllers\Api\Admin\PlaceController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\WorkspaceController as AdminWorkspaceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\WorkspaceParticipantController;
use App\Http\Controllers\Api\WorkspacePlaceController;
use App\Http\Controllers\Api\WorkspaceSuggestionController;
use App\Http\Controllers\Api\WorkspaceTimelineController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GuideBookingController;
use App\Http\Controllers\Api\GuideController;
// ─────────────────────────────────────────────────────────
// Public — Auth
// ─────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// ─────────────────────────────────────────────────────────
// Public — Browse
// ─────────────────────────────────────────────────────────
Route::get('cities',         [CityController::class, 'index']);
Route::get('cities/{city}',  [CityController::class, 'show']);
Route::get('places',         [PlaceController::class, 'index']);
Route::get('places/{place}', [PlaceController::class, 'show']);
// Public — Guides
Route::get('guides',        [GuideController::class, 'index']);
Route::get('guides/{guide}', [GuideController::class, 'show']);

// ─────────────────────────────────────────────────────────
// Protected — auth:sanctum
// ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Workspaces CRUD
    Route::apiResource('workspaces', WorkspaceController::class);

            // Guide Bookings
    Route::post('guide-bookings',                    [GuideBookingController::class, 'store']);
    Route::get('guide-bookings',                     [GuideBookingController::class, 'myBookings']);
    Route::get('guide-bookings/requests',            [GuideBookingController::class, 'guideRequests']);
    Route::patch('guide-bookings/{booking}/respond', [GuideBookingController::class, 'respond']);
    Route::patch('guide-bookings/{booking}/cancel',  [GuideBookingController::class, 'cancel']);
    // Workspace sub-resources
    Route::prefix('workspaces/{workspace}')->group(function () {

        // Places
        Route::get('places',            [WorkspacePlaceController::class, 'index']);
        Route::post('places',           [WorkspacePlaceController::class, 'store']);
        Route::delete('places/{place}', [WorkspacePlaceController::class, 'destroy']);

        // Participants
        Route::post('invite',                  [WorkspaceParticipantController::class, 'invite']);
        Route::post('accept',                  [WorkspaceParticipantController::class, 'accept']);
        Route::post('decline',                 [WorkspaceParticipantController::class, 'decline']);
        Route::delete('participants/{userId}', [WorkspaceParticipantController::class, 'remove']);

        // Timeline
        Route::get('timeline',                              [WorkspaceTimelineController::class, 'index']);
        Route::post('timeline',                             [WorkspaceTimelineController::class, 'store']);
        Route::put('timeline/{item}',                       [WorkspaceTimelineController::class, 'update']);
        Route::delete('timeline/{item}',                    [WorkspaceTimelineController::class, 'destroy']);
        Route::post('timeline/{item}/participants',         [WorkspaceTimelineController::class, 'addParticipant']);
        Route::delete('timeline/{item}/participants/{userId}', [WorkspaceTimelineController::class, 'removeParticipant']);

        // Suggestions
        Route::get('suggestions',                   [WorkspaceSuggestionController::class, 'index']);
        Route::get('suggestions/pending',           [WorkspaceSuggestionController::class, 'pending']);
        Route::post('suggestions',                  [WorkspaceSuggestionController::class, 'store']);
        Route::post('suggestions/{suggestion}/respond', [WorkspaceSuggestionController::class, 'respond']);


    });
});

// ─────────────────────────────────────────────────────────
// Admin only — auth:sanctum + role:admin
// ─────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // Cities + Places CRUD
    Route::apiResource('cities', CityController::class);
    Route::apiResource('places', PlaceController::class);

    // Users Management
    Route::get('users',                            [UserController::class, 'index']);
    Route::get('users/{user}',                     [UserController::class, 'show']);
    Route::put('users/{user}',                     [UserController::class, 'update']);
    Route::delete('users/{user}',                  [UserController::class, 'destroy']);
    Route::post('users/{id}/restore',              [UserController::class, 'restore']);
    Route::post('users/{user}/toggle-verification',[UserController::class, 'toggleVerification']);

    // Workspaces
    Route::prefix('workspaces')->group(function () {
        Route::get('/',                        [AdminWorkspaceController::class, 'index']);
        Route::get('/{workspace}',             [AdminWorkspaceController::class, 'show']);
        Route::delete('/{workspace}',          [AdminWorkspaceController::class, 'destroy']);
        Route::get('/{workspace}/participants',[AdminWorkspaceController::class, 'participants']);
        Route::get('/{workspace}/places',      [AdminWorkspaceController::class, 'places']);
        Route::get('/{workspace}/timeline',    [AdminWorkspaceController::class, 'timeline']);
        Route::get('/{workspace}/suggestions', [AdminWorkspaceController::class, 'suggestions']);
    });
});