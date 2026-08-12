import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import userService from '../../services/userService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function ViewUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await userService.getUser(id);

                setUser(data.user);
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

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <div>
                <PageHeader
                    title="User Details"
                    subtitle="View user account information."
                />

                <ErrorMessage
                    message={error || 'User not found.'}
                />

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/users')}
                >
                    Back to Users
                </Button>
            </div>
        );
    }

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString();
    };

    return (
        <div>
            <PageHeader
                title="User Details"
                subtitle="View user account information."
            />

            <ErrorMessage message={error} />

            <div className="max-w-4xl rounded-lg bg-white p-6 shadow-sm">

                {/* Basic Information */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                User ID
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.id}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Name
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Email
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.email || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Role
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.roles && user.roles.length > 0
                                    ? user.roles.join(', ')
                                    : '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Matching
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.is_matching_enabled
                                    ? 'Enabled'
                                    : 'Disabled'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Email Verified
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.email_verified_at
                                    ? 'Verified'
                                    : 'Not Verified'}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Profile Information */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Profile Information
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                                Bio
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-base text-gray-900">
                                {user.bio || '-'}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                                Languages
                            </p>

                            {Array.isArray(user.languages) &&
                            user.languages.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {user.languages.map(
                                        (language, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                            >
                                                {language}
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="mt-1 text-base text-gray-900">
                                    -
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Profile Photo
                            </p>

                            {user.profile_photo ? (
                                <img
                                    src={user.profile_photo}
                                    alt={user.name}
                                    className="mt-2 h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <p className="mt-1 text-base text-gray-900">
                                    No profile photo
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Account Status */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Account Status
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Account Status
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.is_deleted
                                    ? 'Deleted'
                                    : 'Active'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Deleted At
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {formatDate(user.deleted_at)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Email Verified At
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {formatDate(user.email_verified_at)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Accommodations
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {user.accommodations_count ?? 0}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Dates */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                        Account Dates
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Created At
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {formatDate(user.created_at)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Last Updated
                            </p>

                            <p className="mt-1 text-base text-gray-900">
                                {formatDate(user.updated_at)}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">

                    <Link to={`/users/${user.id}/edit`}>
                        <Button>
                            Edit User
                        </Button>
                    </Link>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/users')}
                    >
                        Back to Users
                    </Button>

                </div>

            </div>
        </div>
    );
}
