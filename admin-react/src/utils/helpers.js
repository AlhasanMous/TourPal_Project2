export const getBackendBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
    return apiUrl.replace(/\/api\/?$/, '');
};

export const getProfileImageUrl = (photo) => {
    if (!photo) {
        return null;
    }

    if (/^https?:\/\//i.test(photo)) {
        return photo;
    }

    if (photo.startsWith('/storage/')) {
        return `${getBackendBaseUrl()}${photo}`;
    }

    if (photo.startsWith('storage/')) {
        return `${getBackendBaseUrl()}/${photo}`;
    }

    if (photo.startsWith('profile-photos/') || photo.startsWith('avatars/')) {
        return `${getBackendBaseUrl()}/storage/${photo}`;
    }

    return `${getBackendBaseUrl()}/storage/${photo}`;
};
