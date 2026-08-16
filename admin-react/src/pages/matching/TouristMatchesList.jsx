import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import matchingService from '../../services/matchingService';
import cityService from '../../services/cityService';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function TouristMatchesList() {
    const [matches, setMatches] = useState([]);
    const [cities, setCities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [status, setStatus] = useState('');
    const [cityId, setCityId] = useState('');

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchMatches = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (status) {
                params.status = status;
            }

            if (cityId) {
                params.city_id = cityId;
            }

            const data = await matchingService.getMatches(params);

            setMatches(data.matches ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load tourist matches.'
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const data = await cityService.getAll();

            setCities(data ?? []);
        } catch (err) {
            console.error('Failed to load cities:', err);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        fetchMatches(page);
    }, [page, status, cityId]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handleCityChange = (e) => {
        setCityId(e.target.value);
        setPage(1);
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const getStatusClass = (matchStatus) => {
        switch (matchStatus) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-amber-200';

            case 'connected':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

            case 'declined':
                return 'bg-rose-50 text-rose-700 ring-rose-200';

            default:
                return 'bg-slate-50 text-slate-600 ring-slate-200';
        }
    };

    const getStatusLabel = (matchStatus) => {
        switch (matchStatus) {
            case 'pending':
                return 'Pending';

            case 'connected':
                return 'Connected';

            case 'declined':
                return 'Declined';

            default:
                return matchStatus ?? '-';
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'Match ID',
            render: (match) => (
                <span className="font-medium text-slate-700">
                    #{match.id}
                </span>
            ),
        },

        {
            key: 'user1',
            label: 'Tourist 1',
            render: (match) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {match.user1?.name ?? '-'}
                    </div>

                    <div className="text-xs text-slate-400">
                        {match.user1?.email ?? '-'}
                    </div>
                </div>
            ),
        },

        {
            key: 'user2',
            label: 'Tourist 2',
            render: (match) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {match.user2?.name ?? '-'}
                    </div>

                    <div className="text-xs text-slate-400">
                        {match.user2?.email ?? '-'}
                    </div>
                </div>
            ),
        },

        {
            key: 'city',
            label: 'City',
            render: (match) => (
                <span className="text-slate-600">
                    {match.city ?? '-'}
                </span>
            ),
        },

        {
            key: 'workspace',
            label: 'Workspace',
            render: (match) => (
                <span className="text-slate-600">
                    {match.workspace ?? '-'}
                </span>
            ),
        },

        {
            key: 'status',
            label: 'Status',
            render: (match) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                        match.status
                    )}`}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />

                    {getStatusLabel(match.status)}
                </span>
            ),
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (match) => (
                <span className="text-slate-500">
                    {formatDate(match.created_at)}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Tourist Matches"
                subtitle="Monitor tourist matching activity."
            />

            {/* Statistics */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Matches
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {meta?.total ?? 0}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Pending
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-amber-600">
                        {matches.filter(
                            (match) => match.status === 'pending'
                        ).length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Connected
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-emerald-600">
                        {matches.filter(
                            (match) => match.status === 'connected'
                        ).length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Declined
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-rose-600">
                        {matches.filter(
                            (match) => match.status === 'declined'
                        ).length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="md:w-56">
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                All Statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="connected">
                                Connected
                            </option>

                            <option value="declined">
                                Declined
                            </option>
                        </select>
                    </div>

                    <div className="md:w-56">
                        <label className="mb-1 block text-sm font-medium text-slate-600">
                            City
                        </label>

                        <select
                            value={cityId}
                            onChange={handleCityChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                All Cities
                            </option>

                            {cities.map((city) => (
                                <option
                                    key={city.id}
                                    value={city.id}
                                >
                                    {city.name_en}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(status || cityId) && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setStatus('');
                                setCityId('');
                                setPage(1);
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <DataTable
                            columns={columns}
                            data={matches}
                            emptyMessage="No tourist matches found."
                            actions={(match) => (
                                <div className="flex items-center justify-end">
                                    <Link
                                        to={`/matching/${match.id}`}
                                    >
                                        <Button variant="secondary">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        />
                    </div>

                    {meta && meta.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Page{' '}
                                <span className="font-medium text-slate-700">
                                    {meta.current_page}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium text-slate-700">
                                    {meta.last_page}
                                </span>{' '}
                                <span className="text-slate-400">
                                    ({meta.total} total)
                                </span>
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
