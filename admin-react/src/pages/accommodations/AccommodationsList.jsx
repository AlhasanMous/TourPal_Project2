import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import accommodationService from '../../services/accommodationService';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    Search as SearchIcon,
    Eye,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Clock,
    CheckCircle2,
    XCircle,
    Building2,
    CalendarDays,
} from 'lucide-react';

export default function AccommodationsList() {
    const [accommodations, setAccommodations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchAccommodations = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (search.trim()) {
                params.search = search.trim();
            }

            if (status) {
                params.status = status;
            }

            if (type) {
                params.type = type;
            }

            const data =
                await accommodationService.getAccommodations(params);

            setAccommodations(data.accommodations ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    'Failed to load accommodations.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccommodations(page);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (page !== 1) {
            setPage(1);
        } else {
            fetchAccommodations(1);
        }
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setPage(1);
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const getStatusClass = (value) => {
        switch (value) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

            case 'rejected':
                return 'bg-rose-50 text-rose-700 ring-rose-200';

            case 'pending':
            default:
                return 'bg-amber-50 text-amber-700 ring-amber-200';
        }
    };

    const getStatusDotClass = (value) => {
        switch (value) {
            case 'approved':
                return 'bg-emerald-500';

            case 'rejected':
                return 'bg-rose-500';

            case 'pending':
            default:
                return 'bg-amber-500';
        }
    };

    const getStatusLabel = (value) => {
        switch (value) {
            case 'approved':
                return 'Approved';

            case 'rejected':
                return 'Rejected';

            case 'pending':
            default:
                return 'Pending';
        }
    };

    const getTypeLabel = (value) => {
        switch (value) {
            case 'hotel':
                return 'Hotel';

            case 'hostel':
                return 'Hostel';

            case 'shared':
                return 'Shared';

            default:
                return value ?? '-';
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Accommodation',
            render: (accommodation) => (
                <div className="flex items-center gap-3">
                    {accommodation.main_image ? (
                        <img
                            src={accommodation.main_image}
                            alt={accommodation.name}
                            className="h-12 w-16 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                    ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200">
                            <Building2 className="h-5 w-5 text-slate-400" />
                        </div>
                    )}

                    <div>
                        <div className="font-medium text-slate-900">
                            {accommodation.name}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-400">
                            ID #{accommodation.id}
                        </div>
                    </div>
                </div>
            ),
        },

        {
            key: 'host',
            label: 'Host',
            render: (accommodation) =>
                accommodation.host ? (
                    <div>
                        <div className="font-medium text-slate-700">
                            {accommodation.host.name}
                        </div>

                        <div className="text-xs text-slate-400">
                            {accommodation.host.email}
                        </div>
                    </div>
                ) : (
                    <span className="text-slate-300">-</span>
                ),
        },

        {
            key: 'city',
            label: 'City',
            render: (accommodation) => (
                <span className="text-slate-600">
                    {accommodation.city?.name_en ??
                        accommodation.city?.name_ar ??
                        '-'}
                </span>
            ),
        },

        {
            key: 'type',
            label: 'Type',
            render: (accommodation) => (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {getTypeLabel(accommodation.type)}
                </span>
            ),
        },

        {
            key: 'verification_status',
            label: 'Status',
            render: (accommodation) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                        accommodation.verification_status
                    )}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDotClass(
                            accommodation.verification_status
                        )}`}
                    />

                    {getStatusLabel(
                        accommodation.verification_status
                    )}
                </span>
            ),
        },

        {
            key: 'bookings_count',
            label: 'Bookings',
            render: (accommodation) => (
                <span className="font-medium text-slate-700">
                    {accommodation.bookings_count ?? 0}
                </span>
            ),
        },

        {
            key: 'reviews_count',
            label: 'Reviews',
            render: (accommodation) => (
                <span className="font-medium text-slate-700">
                    {accommodation.reviews_count ?? 0}
                </span>
            ),
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (accommodation) => (
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(accommodation.created_at)}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Accommodations"
                subtitle="Manage TourPal accommodations and verification requests."
            />

            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-4 lg:flex-row lg:items-end"
                >
                    <div className="flex-1">
                        <Input
                            label="Search"
                            type="text"
                            placeholder="Search by accommodation name..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="lg:w-48">
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                All statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>
                        </select>
                    </div>

                    <div className="lg:w-48">
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            Type
                        </label>

                        <select
                            value={type}
                            onChange={handleTypeChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                All types
                            </option>

                            <option value="hotel">
                                Hotel
                            </option>

                            <option value="hostel">
                                Hostel
                            </option>

                            <option value="shared">
                                Shared
                            </option>
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
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                            <div className="text-xs text-slate-400">
                                Total Accommodations
                            </div>

                            <div className="mt-0.5 text-lg font-semibold text-slate-800">
                                {meta?.total ?? accommodations.length}
                            </div>
                        </div>

                        <Link to="/accommodations/pending">
                            <div className="cursor-pointer rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 shadow-sm transition hover:bg-amber-100">
                                <div className="flex items-center gap-1.5 text-xs text-amber-700">
                                    <Clock className="h-3.5 w-3.5" />
                                    Pending Verification
                                </div>

                                <div className="mt-0.5 text-lg font-semibold text-amber-800">
                                    Review Pending
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <DataTable
                            columns={columns}
                            data={accommodations}
                            emptyMessage="No accommodations found."
                            actions={(accommodation) => (
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <Link
                                        to={`/accommodations/${accommodation.id}`}
                                    >
                                        <Button variant="secondary">
                                            <Eye className="mr-1.5 inline-block h-4 w-4 text-slate-600" />
                                            View
                                        </Button>
                                    </Link>

                                    {accommodation.verification_status ===
                                        'pending' && (
                                        <Link
                                            to={`/accommodations/${accommodation.id}`}
                                        >
                                            <Button variant="secondary">
                                                <Clock className="mr-1.5 inline-block h-4 w-4 text-amber-600" />
                                                Review
                                            </Button>
                                        </Link>
                                    )}
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
                                    disabled={meta.current_page <= 1}
                                    onClick={() =>
                                        setPage(
                                            (prev) => prev - 1
                                        )
                                    }
                                >
                                    <ChevronLeft className="mr-1 inline-block h-4 w-4" />
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
