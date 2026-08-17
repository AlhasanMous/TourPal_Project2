import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiMap,
    HiMapPin,
    HiUsers,
    HiBriefcase,
    HiClipboardDocumentList,
    HiArrowTrendingUp,
    HiSparkles,
    HiHomeModern,
    HiExclamationTriangle,
    HiArrowRight,
} from 'react-icons/hi2';

import cityService from '../services/cityService';
import placeService from '../services/placeService';
import userService from '../services/userService';
import guideService from '../services/guideService';
import workspaceService from '../services/workspaceService';
import accommodationService from '../services/accommodationService';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const StatCard = ({ title, value, icon: Icon, tone = 'indigo' }) => {
    const tones = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        violet: 'bg-violet-50 text-violet-600',
        amber: 'bg-amber-50 text-amber-600',
        sky: 'bg-sky-50 text-sky-600',
        rose: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-800">{value}</h2>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
                    <Icon className="text-xl" />
                </div>
            </div>
        </div>
    );
};

// purely visual — a "needs attention" card with a count + Review button,
// used by the Quick Actions section. Not tied to any specific resource.
const ActionCard = ({ title, value, description, to, icon: Icon, tone = 'rose' }) => {
    const tones = {
        rose: 'bg-rose-50 text-rose-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
                    <Icon className="text-xl" />
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
                        <span className="text-xs text-slate-400">{description}</span>
                    </div>
                </div>
            </div>

            <Link
                to={to}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
                Review
                <HiArrowRight className="text-sm" />
            </Link>
        </div>
    );
};

const extractTotal = (payload, fallback = 0) => {
    if (!payload) {
        return fallback;
    }

    if (typeof payload === 'number') {
        return payload;
    }

    if (Array.isArray(payload)) {
        return payload.length;
    }

    if (typeof payload.meta?.total === 'number') {
        return payload.meta.total;
    }

    if (typeof payload.total === 'number') {
        return payload.total;
    }

    if (Array.isArray(payload.data)) {
        return payload.data.length;
    }

    if (Array.isArray(payload.users)) {
        return payload.users.length;
    }

    if (Array.isArray(payload.guides)) {
        return payload.guides.length;
    }

    if (Array.isArray(payload.workspaces)) {
        return payload.workspaces.length;
    }

    if (Array.isArray(payload.cities)) {
        return payload.cities.length;
    }

    if (Array.isArray(payload.places)) {
        return payload.places.length;
    }

    if (Array.isArray(payload.accommodations)) {
        return payload.accommodations.length;
    }

    return fallback;
};

const formatDate = (date) => {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function Dashboard() {
    const [stats, setStats] = useState({
        cities: 0,
        places: 0,
        users: 0,
        guides: 0,
        workspaces: 0,
        pendingGuides: 0,
        accommodations: 0,
        pendingAccommodations: 0,
    });
    const [recentActivities, setRecentActivities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                cities,
                placesData,
                usersData,
                guidesData,
                workspacesData,
                pendingGuidesData,
                accommodationsData,
                pendingAccommodationsData,
            ] = await Promise.all([
                cityService.getAll(),
                placeService.getPlaces({ per_page: 1 }),
                userService.getUsers({ per_page: 5 }),
                guideService.getGuides({ per_page: 5 }),
                workspaceService.getWorkspaces({ per_page: 5 }),
                guideService.getPending({ per_page: 1 }),
                accommodationService.getAccommodations({ per_page: 1 }),
                accommodationService.getPendingAccommodations({ per_page: 1 }),
            ]);

            const users = Array.isArray(usersData.users) ? usersData.users : [];
            const guides = Array.isArray(guidesData.guides) ? guidesData.guides : [];
            const workspaces = Array.isArray(workspacesData.workspaces) ? workspacesData.workspaces : [];

            setStats({
                cities: Array.isArray(cities) ? cities.length : 0,
                places: extractTotal(placesData),
                users: extractTotal(usersData),
                guides: extractTotal(guidesData),
                workspaces: extractTotal(workspacesData),
                pendingGuides: extractTotal(pendingGuidesData),
                accommodations: extractTotal(accommodationsData),
                pendingAccommodations: extractTotal(pendingAccommodationsData),
            });

            const activityList = [
                ...users.slice(0, 3).map((user) => ({
                    type: 'User',
                    title: user.name ?? 'New user',
                    subtitle: user.email ?? 'No email',
                    date: user.created_at,
                    tone: 'emerald',
                })),
                ...guides.slice(0, 3).map((guide) => ({
                    type: 'Guide',
                    title: guide.user?.name ?? 'Guide updated',
                    subtitle: guide.verification_status ?? 'guide',
                    date: guide.created_at,
                    tone: 'violet',
                })),
                ...workspaces.slice(0, 3).map((workspace) => ({
                    type: 'Workspace',
                    title: workspace.name ?? 'Workspace created',
                    subtitle: workspace.owner?.name ?? 'Owner',
                    date: workspace.created_at,
                    tone: 'indigo',
                })),
            ]
                .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
                .slice(0, 6);

            setRecentActivities(activityList);
        } catch (err) {
            console.error('Dashboard statistics error:', err);
            console.error('Response:', err.response?.data);
            console.error('Status:', err.response?.status);

            setError(
                err.response?.data?.message ??
                'Failed to load dashboard statistics.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    const cards = [
        {
            title: 'Cities',
            value: stats.cities,
            icon: HiMap,
            tone: 'indigo',
        },
        {
            title: 'Places',
            value: stats.places,
            icon: HiMapPin,
            tone: 'sky',
        },
        {
            title: 'Users',
            value: stats.users,
            icon: HiUsers,
            tone: 'emerald',
        },
        {
            title: 'Guides',
            value: stats.guides,
            icon: HiBriefcase,
            tone: 'violet',
        },
        {
            title: 'Workspaces',
            value: stats.workspaces,
            icon: HiClipboardDocumentList,
            tone: 'amber',
        },
        {
            title: 'Accommodations',
            value: stats.accommodations,
            icon: HiHomeModern,
            tone: 'sky',
        },
    ];

    // purely visual — items needing admin review, only shown when there's something to review
    const actionItems = [
        {
            key: 'pendingGuides',
            title: 'Pending Guides',
            value: stats.pendingGuides,
            description: 'awaiting verification',
            to: '/guides',
            icon: HiArrowTrendingUp,
            tone: 'rose',
        },
        {
            key: 'pendingAccommodations',
            title: 'Pending Accommodations',
            value: stats.pendingAccommodations,
            description: 'awaiting verification',
            to: '/accommodations/pending',
            icon: HiExclamationTriangle,
            tone: 'amber',
        },
    ];

    return (
        <div>
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
                        <HiSparkles className="text-lg" />
                        TourPal overview
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                    <p className="mt-1 text-gray-500">
                        Welcome to the TourPal admin dashboard.
                    </p>
                </div>
            </div>

            <ErrorMessage
                message={error}
                onRetry={fetchStats}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <StatCard
                        key={card.title}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        tone={card.tone}
                    />
                ))}
            </div>

            {/* Quick Actions — needs-review items, only shown when there's something to act on */}
            {actionItems.some((item) => item.value > 0) && (
                <div className="mt-8">
                    <h2 className="mb-3 text-lg font-semibold text-slate-800">
                        Requires Attention
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {actionItems
                            .filter((item) => item.value > 0)
                            .map((item) => (
                                <ActionCard
                                    key={item.key}
                                    title={item.title}
                                    value={item.value}
                                    description={item.description}
                                    to={item.to}
                                    icon={item.icon}
                                    tone={item.tone}
                                />
                            ))}
                    </div>
                </div>
            )}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
                        <p className="text-sm text-slate-500">Latest updates across the platform</p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {recentActivities.length} items
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Details</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                            {recentActivities.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-slate-500">
                                        No recent activity found.
                                    </td>
                                </tr>
                            ) : (
                                recentActivities.map((item, index) => (
                                    <tr key={`${item.type}-${item.title}-${index}`} className="hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                item.tone === 'emerald'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : item.tone === 'violet'
                                                        ? 'bg-violet-50 text-violet-700'
                                                        : 'bg-indigo-50 text-indigo-700'
                                            }`}>
                                                {item.type}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-sm font-medium text-slate-800">
                                            {item.title}
                                        </td>

                                        <td className="px-5 py-3 text-sm text-slate-600">
                                            {item.subtitle}
                                        </td>

                                        <td className="px-5 py-3 text-sm text-slate-500">
                                            {formatDate(item.date)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
