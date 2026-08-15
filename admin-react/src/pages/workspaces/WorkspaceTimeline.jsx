import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import timelineService from '../../services/timelineService';
import workspaceService from '../../services/workspaceService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';


export default function WorkspaceTimeline() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [workspace, setWorkspace] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // fetch workspace (admin) and timeline (public) and places for mapping
                const [workspaceData, timelineData, placesData] =
                    await Promise.all([
                        workspaceService.getWorkspace(id),
                        timelineService.getTimeline(id),
                        workspaceService.getWorkspacePlaces(id),
                    ]);

                const ws = workspaceData.workspace;
                setWorkspace(ws);

                // build a map of places by id (placesData items wrap the place object)
                const places = (placesData.places || []).reduce((acc, pwp) => {
                    const p = pwp.place ?? pwp;
                    if (p && p.id) acc[p.id] = p;
                    return acc;
                }, {});

                // timeline endpoint may return grouped days [{date, items: [...]}, ...]
                let rawItems = [];
                if (Array.isArray(timelineData.timeline) && timelineData.timeline.length > 0 && timelineData.timeline[0].items) {
                    // flatten grouped days
                    rawItems = timelineData.timeline.flatMap((day) => day.items || []);
                } else {
                    rawItems = timelineData.timeline || [];
                }

                // attach place objects when reference_id exists
                const items = (rawItems).map((it) => {
                    const copy = { ...it };
                    if (it.item_type === 'place' && it.reference_id) {
                        copy.place = places[it.reference_id] || null;
                    }

                    // normalize planned_date: remove time suffix if present
                    if (copy.planned_date) {
                        // keep only date part if ISO string
                        if (typeof copy.planned_date === 'string' && copy.planned_date.includes('T')) {
                            copy.planned_date = copy.planned_date.split('T')[0];
                        }
                    }

                    // normalize planned_time (HH:MM[:ss])
                    if (copy.planned_time && copy.planned_time.length >= 5) {
                        copy.planned_time = copy.planned_time.substring(0, 5);
                    }

                    return copy;
                });

                setTimeline(items);
            } catch (err) {
                console.error('Timeline error:', err);

                setError(
                    err.response?.data?.message ??
                    'Failed to load workspace timeline.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const groupedTimeline = useMemo(() => {
        const groups = {};

        timeline.forEach((item) => {
            const date = item.planned_date ?? 'No Date';

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(item);
        });

        Object.keys(groups).forEach((date) => {
            groups[date].sort((a, b) => {
                const orderA = a.order_in_day ?? 0;
                const orderB = b.order_in_day ?? 0;

                if (orderA !== orderB) {
                    return orderA - orderB;
                }

                return (a.planned_time ?? '').localeCompare(
                    b.planned_time ?? ''
                );
            });
        });

        return groups;
    }, [timeline]);

    const overview = useMemo(() => {
        return {
            total: timeline.length,

            places: timeline.filter(
                (item) => item.item_type === 'place'
            ).length,

            accommodations: timeline.filter(
                (item) => item.item_type === 'accommodation'
            ).length,

            transport: timeline.filter(
                (item) => item.item_type === 'transport'
            ).length,

            notes: timeline.filter(
                (item) => item.item_type === 'note'
            ).length,
        };
    }, [timeline]);

    const participants = workspace?.participants ?? [];

    const formatDate = (date) => {
        if (!date) {
            return 'No Date';
        }

        try {
            // accept either 'YYYY-MM-DD' or full ISO string; normalize to date part
            const datePart = (typeof date === 'string' && date.includes('T')) ? date.split('T')[0] : date;
            const dt = new Date(`${datePart}T00:00:00`);

            return dt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return date;
        }
    };

    const formatTime = (time) => {
        if (!time) {
            return '--:--';
        }

        return time.substring(0, 5);
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'place':
                return 'Place';

            case 'accommodation':
                return 'Accommodation';

            case 'transport':
                return 'Transport';

            case 'note':
                return 'Note';

            default:
                return type ?? 'Activity';
        }
    };

    const getTypeBadgeClass = (type) => {
        switch (type) {
            case 'place':
                return 'bg-blue-100 text-blue-700';

            case 'accommodation':
                return 'bg-purple-100 text-purple-700';

            case 'transport':
                return 'bg-orange-100 text-orange-700';

            case 'note':
                return 'bg-gray-100 text-gray-700';

            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getItemTitle = (item) => {
        return (
            item.label ??
            item.name ??
            item.place?.name_en ??
            item.place?.name_ar ??
            item.title ??
            (item.item_type === 'place' && item.reference_id ? `Place #${item.reference_id}` : 'Timeline Activity')
        );
    };

    if (loading) {
        return <Loading message="Loading workspace timeline..." />;
    }

    return (
        <div>
            <PageHeader
                title="Workspace Timeline"
                subtitle={
                    workspace?.name
                        ? `Timeline for ${workspace.name}`
                        : 'View workspace timeline.'
                }
            />

            <ErrorMessage message={error} />

            {!workspace ? (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="text-gray-500">
                        Workspace not found.
                    </p>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/workspaces')}
                        >
                            Back to Workspaces
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Top Actions */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/workspaces')}
                        >
                            ← Back to Workspaces
                        </Button>


                    </div>

                    {/* Main Layout */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                        {/* Timeline */}
                        <div className="xl:col-span-2">
                            <div className="rounded-lg bg-white p-6 shadow-sm">

                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {workspace.name}
                                    </h2>

                                    {workspace.description && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {workspace.description}
                                        </p>
                                    )}

                                    {(workspace.trip_start_date ||
                                        workspace.trip_end_date) && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            {workspace.trip_start_date ?? '-'}
                                            {' → '}
                                            {workspace.trip_end_date ?? '-'}
                                        </p>
                                    )}
                                </div>

                                {Object.keys(groupedTimeline).length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
                                        <p className="text-gray-500">
                                            No timeline activities yet.
                                        </p>


                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        {Object.entries(
                                            groupedTimeline
                                        ).map(
                                            ([date, items]) => (
                                                <div key={date}>

                                                    {/* Date */}
                                                    <div className="mb-5 flex items-center gap-3">
                                                        <div className="h-3 w-3 rounded-full bg-blue-600" />

                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {formatDate(date)}
                                                        </h3>
                                                    </div>

                                                    {/* Activities */}
                                                    <div className="relative ml-1 border-l-2 border-gray-200 pl-7">

                                                        {items.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="relative mb-6 last:mb-0"
                                                                >

                                                                    {/* Timeline Dot */}
                                                                    <div className="absolute -left-[38px] top-5 h-4 w-4 rounded-full border-4 border-white bg-blue-500 shadow" />

                                                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

                                                                        <div className="flex flex-wrap items-start justify-between gap-3">

                                                                            <div className="flex items-start gap-3">
                                                                                {item.place?.main_image && (
                                                                                    <img
                                                                                        src={item.place.main_image}
                                                                                        alt={item.place.name_en || 'place'}
                                                                                        className="h-16 w-24 rounded object-cover"
                                                                                    />
                                                                                )}

                                                                                <div>
                                                                                    <div className="flex flex-wrap items-center gap-2">

                                                                                        <span className="text-lg font-semibold text-gray-800">
                                                                                            {getItemTitle(item)}
                                                                                        </span>

                                                                                        <span
                                                                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTypeBadgeClass(
                                                                                                item.item_type
                                                                                            )}`}
                                                                                        >
                                                                                            {getTypeLabel(item.item_type)}
                                                                                        </span>

                                                                                    </div>

                                                                                    <p className="mt-2 text-sm font-medium text-gray-600">
                                                                                        {formatTime(item.planned_time)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex gap-2">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="secondary"
                                                                                >
                                                                                    Edit
                                                                                </Button>

                                                                                <Button
                                                                                    type="button"
                                                                                    variant="secondary"
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </div>

                                                                        </div>

                                                                        {item.description && (
                                                                            <p className="mt-3 text-sm text-gray-600">
                                                                                {
                                                                                    item.description
                                                                                }
                                                                            </p>
                                                                        )}

                                                                        {item.note && (
                                                                            <p className="mt-3 rounded bg-white p-3 text-sm text-gray-600">
                                                                                {
                                                                                    item.note
                                                                                }
                                                                            </p>
                                                                        )}

                                                                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">

                                                                            {item.duration_minutes && (
                                                                                <span>
                                                                                    Duration:{' '}
                                                                                    {
                                                                                        item.duration_minutes
                                                                                    }{' '}
                                                                                    min
                                                                                </span>
                                                                            )}

                                                                            {item.participants_count !==
                                                                                undefined && (
                                                                                <span>
                                                                                    {
                                                                                        item.participants_count
                                                                                    }{' '}
                                                                                    participants
                                                                                </span>
                                                                            )}

                                                                            {item.added_by && (
                                                                                <span>
                                                                                    Added by:{' '}
                                                                                    {
                                                                                        item.added_by
                                                                                            .name
                                                                                    }
                                                                                </span>
                                                                            )}

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">

                            {/* Timeline Overview */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">

                                <h2 className="mb-5 text-lg font-semibold text-gray-800">
                                    Timeline Overview
                                </h2>

                                <div className="grid grid-cols-2 gap-4">

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs text-gray-500">
                                            Total Items
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-800">
                                            {overview.total}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs text-gray-500">
                                            Places
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-800">
                                            {overview.places}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs text-gray-500">
                                            Accommodation
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-800">
                                            {overview.accommodations}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs text-gray-500">
                                            Transport
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-800">
                                            {overview.transport}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs text-gray-500">
                                            Notes
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-800">
                                            {overview.notes}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs text-gray-500">
                                            Participants
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-gray-800">
                                            {participants.length}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Participants */}
                            <div className="rounded-lg bg-white p-6 shadow-sm">

                                <div className="mb-5 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Participants
                                    </h2>

                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                        {participants.length}
                                    </span>
                                </div>

                                {participants.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No participants in this workspace.
                                    </p>
                                ) : (
                                    <div className="space-y-3">

                                        {participants.map(
                                            (participant) => (
                                                <div
                                                    key={
                                                        participant.id ??
                                                        participant.user_id
                                                    }
                                                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            {
                                                                participant.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                participant.status
                                                            }
                                                        </p>
                                                    </div>

                                                    <span className="text-xs text-gray-400">
                                                        {participant.joined_at
                                                            ? new Date(
                                                                  participant.joined_at
                                                              ).toLocaleDateString()
                                                            : '-'}
                                                    </span>
                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                            {/* Quick Actions */}
<div className="rounded-lg bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-lg font-semibold text-gray-800">
        Quick Actions
    </h2>

    <div className="space-y-2">

        <Link
            to={`/workspaces/${id}`}
            className="block"
        >
            <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                View Workspace Details
            </div>
        </Link>


        <Link
            to={`/workspaces/${id}/participants`}
            className="block"
        >
            <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                View Participants
            </div>
        </Link>


        <Link
            to={`/workspaces/${id}/suggestions`}
            className="block"
        >
            <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                View Suggestions
            </div>
        </Link>


       <Link
    to={`/workspaces/${id}/places`}
    className="block"
>
    <div className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
        View Workspace Places
    </div>
</Link>


        <button
            type="button"
            className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
            Export Timeline (PDF)
        </button>

    </div>

</div>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
