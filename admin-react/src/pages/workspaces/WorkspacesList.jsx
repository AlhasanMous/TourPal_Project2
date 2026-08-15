
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCollection, HiOutlineSearch, HiOutlineUserGroup, HiOutlineEye } from 'react-icons/hi';
import workspaceService from '../../services/workspaceService';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function WorkspacesList() {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [isPublic, setIsPublic] = useState('');

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchWorkspaces = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (isPublic !== '') {
                params.is_public = isPublic;
            }

            const data = await workspaceService.getWorkspaces(params);

            setWorkspaces(data.workspaces ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load workspaces.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces(page);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (page !== 1) {
            setPage(1);
        } else {
            fetchWorkspaces(1);
        }
    };

    const handleFilterChange = (e) => {
        setIsPublic(e.target.value);
        setPage(1);
    };

    const handleDelete = async (workspace) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${workspace.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await workspaceService.deleteWorkspace(workspace.id);
            fetchWorkspaces(page);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to delete workspace.'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const columns = [
        {
            key: 'name',
            label: 'Workspace',
        },

        {
            key: 'owner',
            label: 'Owner',
            render: (workspace) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {workspace.owner?.name ?? '-'}
                    </div>

                    <div className="text-xs text-gray-500">
                        {workspace.owner?.email ?? ''}
                    </div>
                </div>
            ),
        },

        {
            key: 'trip_dates',
            label: 'Trip Dates',
            render: (workspace) => (
                <div className="text-sm">
                    <div>
                        {formatDate(workspace.trip_start_date)}
                    </div>

                    <div className="text-xs text-gray-500">
                        to {formatDate(workspace.trip_end_date)}
                    </div>
                </div>
            ),
        },

        {
            key: 'is_public',
            label: 'Visibility',
            render: (workspace) => (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                        workspace.is_public
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {workspace.is_public ? 'Public' : 'Private'}
                </span>
            ),
        },

        {
            key: 'participants_count',
            label: 'Participants',
            render: (workspace) =>
                workspace.participants_count ?? 0,
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (workspace) =>
                formatDate(workspace.created_at),
        },
    ];

    return (
        <div>
            <PageHeader
                title={(
                    <>
                        <HiOutlineCollection className="inline-block mr-3 text-3xl text-blue-600 align-middle" />
                        Workspaces
                    </>
                )}
                subtitle="Manage shared trip workspaces."
            />

            {/* Search & Filter */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-4 md:flex-row md:items-end"
                >
                    <div className="flex-1">
                        <div className="relative">
                            <Input
                                label="Search"
                                type="text"
                                placeholder="Search workspaces..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <HiOutlineSearch className="absolute right-3 top-10 text-gray-400" />
                        </div>
                    </div>

                    <div className="md:w-48">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Visibility
                        </label>

                        <select
                            value={isPublic}
                            onChange={handleFilterChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="1">Public</option>
                            <option value="0">Private</option>
                        </select>
                    </div>

                    <Button type="submit">
                        <span className="flex items-center gap-2"><HiOutlineSearch /> Search</span>
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
                        data={workspaces}
                        emptyMessage="No workspaces found."
                        actions={(workspace) => (
                            <div className="flex items-center justify-end gap-2">

                                {/* View */}
                                <Link to={`/workspaces/${workspace.id}`}>
                                    <Button variant="secondary">
                                        <span className="flex items-center gap-2"><HiOutlineEye /> Details</span>
                                    </Button>
                                </Link>


  {/* TimeLine */}
    <Link to={`/workspaces/${workspace.id}/timeline`}>
            <Button variant="secondary">
                Timeline
            </Button>
    </Link>



                                {/* Delete */}
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleDelete(workspace)
                                    }
                                >
                                    Delete
                                </Button>

                            </div>
                        )}
                    />

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">

                            <p className="text-sm text-gray-600">
                                Page {meta.current_page} of {meta.last_page}
                                {' '}({meta.total} total)
                            </p>

                            <div className="flex gap-2">

                                <Button
                                    variant="secondary"
                                    disabled={meta.current_page <= 1}
                                    onClick={() =>
                                        setPage((prev) => prev - 1)
                                    }
                                >
                                    Previous
                                </Button>

                                <Button
                                    variant="secondary"
                                    disabled={
                                        meta.current_page >= meta.last_page
                                    }
                                    onClick={() =>
                                        setPage((prev) => prev + 1)
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

