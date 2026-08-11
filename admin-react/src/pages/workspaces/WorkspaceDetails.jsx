
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import workspaceService from '../../services/workspaceService';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function WorkspaceDetails() {
    const { id } = useParams();

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await workspaceService.getWorkspace(id);
                setWorkspace(data.workspace);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Failed to load workspace.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspace();
    }, [id]);

    if (loading) {
        return <Loading message="Loading workspace..." />;
    }

    if (error) {
        return (
            <div>
                <PageHeader title="Workspace Details" />
                <ErrorMessage message={error} />

                <Link to="/workspaces">
                    <Button variant="secondary">
                        Back to Workspaces
                    </Button>
                </Link>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div>
                <PageHeader title="Workspace Details" />
                <p className="text-gray-500">Workspace not found.</p>

                <Link to="/workspaces">
                    <Button variant="secondary">
                        Back to Workspaces
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title={workspace.name}
                subtitle="Workspace details"
            />

            <div className="mb-6">
                <Link to="/workspaces">
                    <Button variant="secondary">
                        ← Back to Workspaces
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Basic Information */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Workspace Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Name
                            </p>
                            <p className="font-medium text-gray-900">
                                {workspace.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Description
                            </p>
                            <p className="text-gray-900">
                                {workspace.description || 'No description'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Visibility
                            </p>

                            <span
                                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                                    workspace.is_public
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {workspace.is_public
                                    ? 'Public'
                                    : 'Private'}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Trip Start
                            </p>
                            <p className="text-gray-900">
                                {workspace.trip_start_date
                                    ? new Date(
                                          workspace.trip_start_date
                                      ).toLocaleDateString()
                                    : 'Not specified'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Trip End
                            </p>
                            <p className="text-gray-900">
                                {workspace.trip_end_date
                                    ? new Date(
                                          workspace.trip_end_date
                                      ).toLocaleDateString()
                                    : 'Not specified'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Owner */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Owner
                    </h2>

                    {workspace.owner ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Name
                                </p>
                                <p className="font-medium text-gray-900">
                                    {workspace.owner.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Email
                                </p>
                                <p className="text-gray-900">
                                    {workspace.owner.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Roles
                                </p>

                                <div className="mt-1 flex flex-wrap gap-2">
                                    {workspace.owner.roles?.map((role) => (
                                        <span
                                            key={role}
                                            className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No owner information.
                        </p>
                    )}
                </div>

                {/* Participants */}
                <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Participants
                        </h2>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                            {workspace.participants_count ?? 0} participants
                        </span>
                    </div>

                    {workspace.participants?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Name
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                            Joined At
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {workspace.participants.map(
                                        (participant) => (
                                            <tr key={participant.id}>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    {participant.name}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                                                        {participant.status}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {participant.joined_at
                                                        ? new Date(
                                                              participant.joined_at
                                                          ).toLocaleString()
                                                        : '-'}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="py-6 text-center text-gray-500">
                            No participants in this workspace.
                        </p>
                    )}
                </div>

                {/* Metadata */}
                <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">
                        Metadata
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-500">
                                Workspace ID
                            </p>
                            <p className="font-medium text-gray-900">
                                #{workspace.id}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Created At
                            </p>
                            <p className="text-gray-900">
                                {workspace.created_at
                                    ? new Date(
                                          workspace.created_at
                                      ).toLocaleString()
                                    : '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Deleted At
                            </p>
                            <p className="text-gray-900">
                                {workspace.deleted_at
                                    ? new Date(
                                          workspace.deleted_at
                                      ).toLocaleString()
                                    : 'Active'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

