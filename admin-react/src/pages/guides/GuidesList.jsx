import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBriefcase } from 'react-icons/hi2';
import guideService from '../../services/guideService';
import cityService from '../../services/cityService';
import RejectModal from './RejectModal';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    Search as SearchIcon,
    ShieldCheck,
    ShieldX,
    Eye,
    MapPin,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function GuidesList() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingGuide, setRejectingGuide] = useState(null);
    const [cities, setCities] = useState([]);
    const [cityId, setCityId] = useState('');

    const fetchCities = async () => {
        try {
            const cityList = await cityService.getAll();
            setCities(Array.isArray(cityList) ? cityList : []);
        } catch (err) {
            console.error('Failed to load cities for guides filter:', err);
        }
    };

    const fetchGuides = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = { page: currentPage };

            if (search.trim()) params.search = search.trim();
            if (status) params.status = status;
            if (cityId) params.city_id = cityId;

            const data = await guideService.getGuides(params);

            setGuides(data.guides ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to load guides.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        fetchGuides(page);
    }, [page, cityId]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (page !== 1) setPage(1);
        else fetchGuides(1);
    };

    const handleCityChange = (e) => {
        setCityId(e.target.value);
        setPage(1);
    };

    const handleVerify = async (guide, action) => {
        if (action === 'reject') {
            setRejectingGuide(guide);
            setShowRejectModal(true);
            return;
        }

        const confirmed = window.confirm(`Are you sure to ${action} this guide?`);
        if (!confirmed) return;

        try {
            await guideService.verifyGuide(guide.id, action);
            fetchGuides(page);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to update guide.');
        }
    };

    const handleConfirmReject = async (reason) => {
        if (!rejectingGuide) return;

        try {
            await guideService.verifyGuide(rejectingGuide.id, 'reject', reason);
            setShowRejectModal(false);
            setRejectingGuide(null);
            fetchGuides(page);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to reject guide.');
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString();
    };

    // purely visual — status -> badge color/dot map, matches the guide detail page palette
    const verificationBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
            case 'rejected':
                return 'bg-rose-50 text-rose-700 ring-rose-200';
            default:
                return 'bg-amber-50 text-amber-700 ring-amber-200';
        }
    };

    const verificationDotClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-500';
            case 'rejected':
                return 'bg-rose-500';
            default:
                return 'bg-amber-500';
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Guide',
            render: (g) => (
                <div className="flex items-center gap-3">
                    {g.user?.profile_photo ? (
                        <img
                            src={g.user.profile_photo}
                            alt={g.user.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-violet-200 ring-offset-2"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-sm font-semibold text-violet-700 ring-2 ring-violet-200 ring-offset-2">
                            {g.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                    )}

                    <div>
                        <div className="font-medium text-slate-900">{g.user?.name}</div>
                        <div className="text-xs text-slate-400">{g.user?.email}</div>
                    </div>
                </div>
            ),
        },

        {
            key: 'city',
            label: 'City',
            render: (g) => (
                <span className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {g.city?.name_en ?? g.city?.name_ar ?? g.city?.name ?? '-'}
                </span>
            ),
        },

        {
            key: 'verification',
            label: 'Verification',
            render: (g) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${verificationBadgeClass(g.verification_status)}`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${verificationDotClass(g.verification_status)}`} />
                    {g.verification_status ?? '-'}
                </span>
            ),
        },

        {
            key: 'bookings',
            label: 'Bookings',
            render: (g) => (
                <span className="font-medium text-slate-700">{g.bookings_count ?? 0}</span>
            ),
        },

        {
            key: 'reviews',
            label: 'Reviews',
            render: (g) => (
                <span className="font-medium text-slate-700">{g.reviews_count ?? 0}</span>
            ),
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (g) => <span className="text-slate-500">{formatDate(g.created_at)}</span>,
        },
    ];

    return (
        <div>
            <PageHeader
                title={(
                    <>
                        <HiBriefcase className="mr-3 inline-block align-middle text-3xl text-violet-600" />
                        Guides
                    </>
                )}
                subtitle="Manage tour guides."
            />

            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <Input
                            label="Search"
                            type="text"
                            placeholder="Search by guide name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="md:w-48">
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">All</option>
                            <option value="pending">pending</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                        </select>
                    </div>

                    <div className="md:w-52">
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            City
                        </label>
                        <select
                            value={cityId}
                            onChange={handleCityChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name_en || city.name_ar || 'City'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button type="submit">
                        <SearchIcon className="mr-1.5 inline-block h-4 w-4" />
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
                            data={guides}
                            emptyMessage="No guides found."
                            actions={(g) => (
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    {g.verification_status !== 'approved' && (
                                        <Button variant="secondary" onClick={() => handleVerify(g, 'verify')}>
                                            <ShieldCheck className="mr-1.5 inline-block h-4 w-4 text-emerald-600" />
                                            Verify
                                        </Button>
                                    )}

                                    {g.verification_status !== 'rejected' && (
                                        <Button variant="secondary" onClick={() => handleVerify(g, 'reject')}>
                                            <ShieldX className="mr-1.5 inline-block h-4 w-4 text-rose-600" />
                                            Reject
                                        </Button>
                                    )}

                                    <Link to={`/guides/${g.id}`}>
                                        <Button variant="secondary">
                                            <Eye className="mr-1.5 inline-block h-4 w-4 text-slate-600" />
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        />
                    </div>

                    <RejectModal
                        isOpen={showRejectModal}
                        onCancel={() => {
                            setShowRejectModal(false);
                            setRejectingGuide(null);
                        }}
                        onConfirm={handleConfirmReject}
                    />

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
                                    disabled={meta.current_page <= 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                >
                                    <ChevronLeft className="mr-1 inline-block h-4 w-4" />
                                    Previous
                                </Button>

                                <Button
                                    variant="secondary"
                                    disabled={meta.current_page >= meta.last_page}
                                    onClick={() => setPage((prev) => prev + 1)}
                                >
                                    Next
                                    <ChevronRight className="ml-1 inline-block h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
