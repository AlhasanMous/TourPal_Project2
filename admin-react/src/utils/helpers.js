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

export const getImageUrl = (image) => {
    if (!image) {
        return '/images/no-image.png';
    }

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    if (image.startsWith('/storage/')) {
        return `${getBackendBaseUrl()}${image}`;
    }

    if (image.startsWith('storage/')) {
        return `${getBackendBaseUrl()}/${image}`;
    }

    if (image.startsWith('profile-photos/') || image.startsWith('avatars/')) {
        return `${getBackendBaseUrl()}/storage/${image}`;
    }

    if (image.startsWith('/')) {
        return `${getBackendBaseUrl()}${image}`;
    }

    return `${getBackendBaseUrl()}/storage/${image}`;
};
