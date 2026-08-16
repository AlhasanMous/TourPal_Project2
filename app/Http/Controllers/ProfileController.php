<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfilePhotoRequest;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Update textual profile settings.
     * PUT /api/profile
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => $user->fresh(),
        ]);
    }

    /**
     * Upload avatar image (multipart form-data).
     * POST /api/profile/photo
     */
    public function updatePhoto(UpdateProfilePhotoRequest $request): JsonResponse
    {
        $user = $request->user();

        // Delete existing photo if present on public disk
        if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        // Store new image in storage/app/public/profile-photos
        $path = $request->file('photo')->store('profile-photos', 'public');

        $user->update([
            'profile_photo' => $path,
        ]);

        return response()->json([
            'message'       => 'Profile photo updated successfully.',
            'profile_photo' => $path,
            'photo_url'     => asset('storage/' . $path),
            'user'          => $user->fresh(),
        ]);
    }
}
