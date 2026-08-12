import { useEffect, useState } from 'react';
import userService from '../../services/userService';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Link } from 'react-router-dom';
export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchUsers = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (role) {
                params.role = role;
            }

            if (showDeleted) {
                params.deleted = 'true';
            }

            const data = await userService.getUsers(params);

            setUsers(data.users ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load users.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page, showDeleted]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (page !== 1) {
            setPage(1);
        } else {
            fetchUsers(1);
        }
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setPage(1);
    };

    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${user.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await userService.deleteUser(user.id);
            fetchUsers(page);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to delete user.'
            );
        }
    };

    const handleRestore = async (user) => {
        try {
            await userService.restoreUser(user.id);
            fetchUsers(page);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to restore user.'
            );
        }
    };

    const handleVerification = async (user) => {
        try {
            await userService.toggleVerification(user.id);
            fetchUsers(page);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to update verification status.'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const getRoles = (user) => {
        if (!user.roles || user.roles.length === 0) {
            return '-';
        }

        return user.roles.join(', ');
    };

    const columns = [
        {
            key: 'name',
            label: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    {user.profile_photo ? (
                        <img
                            src={user.profile_photo}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                    )}

                    <div>
                        <div className="font-medium text-gray-900">
                            {user.name}
                        </div>

                        <div className="text-xs text-gray-500">
                            {user.email}
                        </div>
                    </div>
                </div>
            ),
        },

        {
            key: 'roles',
            label: 'Role',
            render: (user) => (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {getRoles(user)}
                </span>
            ),
        },

        {
            key: 'verified',
            label: 'Verification',
            render: (user) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.email_verified_at
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {user.email_verified_at
                        ? 'Verified'
                        : 'Not verified'}
                </span>
            ),
        },

        {
            key: 'status',
            label: 'Status',
            render: (user) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.is_deleted
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                    }`}
                >
                    {user.is_deleted ? 'Deleted' : 'Active'}
                </span>
            ),
        },

        {
            key: 'guide',
            label: 'Guide',
            render: (user) =>
                user.guide ? (
                    <div className="text-sm">
                        <div>{user.guide.city ?? '-'}</div>
                        <div className="text-xs text-gray-500">
                            {user.guide.verification_status ?? '-'}
                        </div>
                    </div>
                ) : (
                    '-'
                ),
        },

        {
            key: 'accommodations_count',
            label: 'Accommodations',
            render: (user) =>
                user.accommodations_count ?? 0,
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (user) =>
                formatDate(user.created_at),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Users"
                subtitle="Manage TourPal users."
            />

            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-4 md:flex-row md:items-end"
                >
                    <div className="flex-1">
                        <Input
                            label="Search"
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="md:w-48">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={handleRoleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All roles</option>
                            <option value="admin">Admin</option>
                            <option value="guide">Guide</option>
                            <option value="host">Host</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pb-2">
                        <input
                            id="showDeleted"
                            type="checkbox"
                            checked={showDeleted}
                            onChange={(e) =>
                                setShowDeleted(e.target.checked)
                            }
                            className="h-4 w-4"
                        />

                        <label
                            htmlFor="showDeleted"
                            className="text-sm text-gray-700"
                        >
                            Deleted only
                        </label>
                    </div>

                    <Button type="submit">
                        Search
                    </Button>
                </form>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={users}
                        emptyMessage="No users found."
                        actions={(user) => (




                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        handleVerification(user)
                                    }
                                >
                                    {user.email_verified_at
                                        ? 'Unverify'
                                        : 'Verify'}
                                </Button>

<Link to={`/users/${user.id}/edit`}>
    <Button variant="secondary">
        Edit
    </Button>
</Link>


<Link to={`/users/${user.id}`}>
    <Button variant="secondary">
        View
    </Button>
</Link>

                                {user.is_deleted ? (
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            handleRestore(user)
                                        }
                                    >
                                        Restore
                                    </Button>
                                ) : (
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDelete(user)
                                        }
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        )}
                    />

                    {meta && meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {meta.current_page} of{' '}
                                {meta.last_page}
                                {' '}({meta.total} total)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    disabled={
                                        meta.current_page <= 1
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) => prev - 1
                                        )
                                    }
                                >
                                    Previous
                                </Button>

                                <Button
                                    variant="secondary"
                                    disabled={
                                        meta.current_page >=
                                        meta.last_page
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) => prev + 1
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
