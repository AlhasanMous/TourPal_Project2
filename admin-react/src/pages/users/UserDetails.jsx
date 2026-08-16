import { useEffect, useState } from 'react';
import { getProfileImageUrl } from '../../utils/helpers';
import userService from '../../services/userService';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

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

    // small role -> ring color map, purely visual
    const roleRingClass = (user) => {
        const primary = user.roles?.[0];
        switch (primary) {
            case 'admin':
                return 'ring-violet-200 bg-violet-50 text-violet-700';
            case 'guide':
                return 'ring-teal-200 bg-teal-50 text-teal-700';
            case 'host':
                return 'ring-amber-200 bg-amber-50 text-amber-700';
            default:
                return 'ring-indigo-200 bg-indigo-50 text-indigo-700';
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    {user.profile_photo ? (
                        <img
                            src={getProfileImageUrl(user.profile_photo)}
                            alt={user.name}
                            className={`h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 ${roleRingClass(user)}`}
                        />
                    ) : (
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-offset-2 ${roleRingClass(user)}`}
                        >
                            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                    )}

                    <div>
                        <div className="font-medium text-slate-900">
                            {user.name}
                        </div>

                        <div className="text-xs text-slate-400">
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
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {getRoles(user)}
                </span>
            ),
        },

        {
            key: 'verified',
            label: 'Verification',
            render: (user) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.email_verified_at
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-amber-50 text-amber-700 ring-amber-200'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            user.email_verified_at ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                    />
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
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.is_deleted
                            ? 'bg-rose-50 text-rose-700 ring-rose-200'
                            : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            user.is_deleted ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                    />
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
                        <div className="font-medium text-slate-700">{user.guide.city ?? '-'}</div>
                        <div className="text-xs text-slate-400">
                            {user.guide.verification_status ?? '-'}
                        </div>
                    </div>
                ) : (
                    <span className="text-slate-300">-</span>
                ),
        },

        {
            key: 'accommodations_count',
            label: 'Accommodations',
            render: (user) => (
                <span className="font-medium text-slate-700">
                    {user.accommodations_count ?? 0}
                </span>
            ),
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (user) => (
                <span className="text-slate-500">{formatDate(user.created_at)}</span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Users"
                subtitle="Manage TourPal users."
            />

            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
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
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={handleRoleChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                        />

                        <label
                            htmlFor="showDeleted"
                            className="text-sm text-slate-600"
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
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
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
                    </div>

                    {meta && meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Page <span className="font-medium text-slate-700">{meta.current_page}</span> of{' '}
                                <span className="font-medium text-slate-700">{meta.last_page}</span>
                                {' '}
                                <span className="text-slate-400">({meta.total} total)</span>
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
