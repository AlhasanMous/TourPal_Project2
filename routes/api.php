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
use App\Http\Controllers\Api\Admin\GuideController as AdminGuideController;
use App\Http\Controllers\Api\GuideProfileController;
use App\Http\Controllers\Api\Admin\AccommodationController as AdminAccommodationController;
use App\Http\Controllers\Api\AccommodationController;
use App\Http\Controllers\Api\Host\HostAccommodationController;
use App\Http\Controllers\Api\Admin\TransportCompanyController;
use App\Http\Controllers\Api\Admin\TransportRouteController;
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

// ─── Public - Accommodations ──────────────────────────────────────────────
Route::get('accommodations',                [AccommodationController::class, 'index']);
Route::get('accommodations/{accommodation}',[AccommodationController::class, 'show']);
// ─────────────────────────────────────────────────────────
// Protected — auth:sanctum
// ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () 
{

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Guide Profile
    Route::prefix('guide')->group(function () {
    Route::post('profile', [GuideProfileController::class, 'store']);
    Route::get('profile',  [GuideProfileController::class, 'show']);
    Route::put('profile',  [GuideProfileController::class, 'update']);
});

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

// ─── Host ─────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('host')->group(function () {
        Route::get('accommodations',                    [HostAccommodationController::class, 'index']);
        Route::post('accommodations',                   [HostAccommodationController::class, 'store']);
        Route::put('accommodations/{accommodation}',    [HostAccommodationController::class, 'update']);
        Route::delete('accommodations/{accommodation}', [HostAccommodationController::class, 'destroy']);
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
    // Admin Guides
        Route::get('guides/pending',          [AdminGuideController::class, 'pending']);
        Route::get('guides',                  [AdminGuideController::class, 'index']);
        Route::post('guides',                 [AdminGuideController::class, 'store']);
        Route::get('guides/{guide}',          [AdminGuideController::class, 'show']);
        Route::post('guides/{guide}/verify',  [AdminGuideController::class, 'verify']);
// Transport
Route::prefix('transport')->group(function () {
    // Companies
    Route::get('companies',              [TransportCompanyController::class, 'index']);
    Route::post('companies',             [TransportCompanyController::class, 'store']);
    Route::put('companies/{company}',    [TransportCompanyController::class, 'update']);
    Route::delete('companies/{company}', [TransportCompanyController::class, 'destroy']);

    // Routes
    Route::get('routes',             [TransportRouteController::class, 'index']);
    Route::post('routes',            [TransportRouteController::class, 'store']);
    Route::put('routes/{route}',     [TransportRouteController::class, 'update']);
    Route::delete('routes/{route}',  [TransportRouteController::class, 'destroy']);
});
    // Admin Accommodations
        Route::get('accommodations/pending',                      [AdminAccommodationController::class, 'pending']);
        Route::get('accommodations',                              [AdminAccommodationController::class, 'index']);
        Route::post('accommodations',                             [AdminAccommodationController::class, 'store']);
        Route::get('accommodations/{accommodation}',              [AdminAccommodationController::class, 'show']);
        Route::post('accommodations/{accommodation}/verify',      [AdminAccommodationController::class, 'verify']);
    });