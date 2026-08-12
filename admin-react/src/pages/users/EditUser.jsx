import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import userService from '../../services/userService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: '',
        email: '',
        bio: '',
        languages: [],
        is_matching_enabled: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await userService.getUser(id);
                const user = data.user;

                setForm({
                    name: user.name ?? '',
                    email: user.email ?? '',
                    bio: user.bio ?? '',
                    languages: Array.isArray(user.languages)
                        ? user.languages
                        : [],
                    is_matching_enabled:
                        Boolean(user.is_matching_enabled),
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ??
                    'Failed to load user.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleLanguagesChange = (e) => {
        const value = e.target.value;

        const languages = value
            .split(',')
            .map((language) => language.trim())
            .filter(Boolean);

        setForm((prev) => ({
            ...prev,
            languages,
        }));

        setErrors((prev) => ({
            ...prev,
            languages: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError('');
        setErrors({});

        try {
            await userService.updateUser(id, form);

            navigate('/users');
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors =
                    err.response.data.errors ?? {};

                const mapped = {};

                Object.keys(serverErrors).forEach((key) => {
                    mapped[key] = serverErrors[key][0];
                });

                setErrors(mapped);
            } else {
                setError(
                    err.response?.data?.message ??
                    'Failed to update user.'
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader
                title="Edit User"
                subtitle="Update user account information."
            />

            <ErrorMessage message={error} />

            <div className="max-w-3xl rounded-lg bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <Input
                            label="Name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Bio
                        </label>

                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errors.bio && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.bio}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Languages
                        </label>

                        <input
                            type="text"
                            value={form.languages.join(', ')}
                            onChange={handleLanguagesChange}
                            placeholder="Arabic, English, French"
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Separate languages with commas.
                        </p>

                        {errors.languages && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.languages}
                            </p>
                        )}
                    </div>

                    <div className="mb-6 flex items-center gap-2">
                        <input
                            id="is_matching_enabled"
                            name="is_matching_enabled"
                            type="checkbox"
                            checked={form.is_matching_enabled}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    is_matching_enabled:
                                        e.target.checked,
                                }))
                            }
                            className="h-4 w-4"
                        />

                        <label
                            htmlFor="is_matching_enabled"
                            className="text-sm font-medium text-gray-700"
                        >
                            Enable matching
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/users')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
