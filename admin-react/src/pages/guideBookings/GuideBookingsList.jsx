import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiEye,
    HiXMark,
    HiMagnifyingGlass,
    HiChevronLeft,
    HiChevronRight,
    HiCalendarDays,
    HiUser,
    HiBriefcase,
} from 'react-icons/hi2';

import guideBookingService from '../../services/guideBookingService';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-emerald-50 text-emerald-700',
    accepted: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-blue-50 text-blue-700',
    cancelled: 'bg-rose-50 text-rose-700',
    canceled: 'bg-rose-50 text-rose-700',
    rejected: 'bg-red-50 text-red-700',
};

const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    accepted: 'Accepted',
    completed: 'Completed',
    cancelled: 'Cancelled',
    canceled: 'Cancelled',
    rejected: 'Rejected',
};

const getStatusClass = (status) => {
    return statusStyles[status] || 'bg-slate-100 text-slate-600';
};

const getStatusLabel = (status) => {
    return statusLabels[status] || status || '-';
};

const getImageUrl = (path) => {
    if (!path) return null;

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
};

export default function GuideBookingsList() {
    const [bookings, setBookings] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async (page = 1) => {
        try {
            setLoading(true);
            setError('');

            const response = await guideBookingService.getBookings({
                page,
                status: status || undefined,
            });

            const data = Array.isArray(response?.bookings)
                ? response.bookings
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            setBookings(data);

            setMeta({
                current_page:
                    response?.meta?.current_page ??
                    response?.current_page ??
                    1,

                last_page:
                    response?.meta?.last_page ??
                    response?.last_page ??
                    1,

                total:
                    response?.meta?.total ??
                    response?.total ??
                    data.length,
            });
        } catch (err) {
            console.error('Guide bookings error:', err);
            console.error('Response:', err.response?.data);

            setError(
                err.response?.data?.message ||
                'Failed to load guide bookings.'
            );

            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(1);
    }, [status]);

    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this booking?'
        );

        if (!confirmed) return;

        try {
            await guideBookingService.cancelBooking(id);

            await fetchBookings(meta.current_page);
        } catch (err) {
            console.error('Cancel booking error:', err);

            alert(
                err.response?.data?.message ||
                'Failed to cancel the booking.'
            );
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (!search.trim()) return true;

        const term = search.toLowerCase();

        const touristName =
            booking.tourist?.name?.toLowerCase() || '';

        const touristEmail =
            booking.tourist?.email?.toLowerCase() || '';

        const guideName =
            booking.guide?.name?.toLowerCase() || '';

        const city =
            booking.guide?.city?.toLowerCase() || '';

        return (
            touristName.includes(term) ||
            touristEmail.includes(term) ||
            guideName.includes(term) ||
            city.includes(term)
        );
    });

    if (loading) {
        return <Loading message="Loading guide bookings..." />;
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Guide Bookings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage guide booking requests and reservations.
                    </p>
                </div>

                <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                    {meta.total} Total Bookings
                </div>
            </div>

            {/* Error */}
            <ErrorMessage
                message={error}
                onRetry={() => fetchBookings(meta.current_page)}
            />

            {/* Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Search */}
                    <div className="relative">
                        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tourist, guide or city..."
                            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="accepted">Accepted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </select>

                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">

                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Guide
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Tourist
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Date
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Time
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    City
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">

                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-5 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <HiCalendarDays className="text-4xl text-slate-300" />

                                            <p className="mt-3 text-sm font-medium text-slate-600">
                                                No guide bookings found
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Try changing your filters or search.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => {

                                    const guideImage =
                                        getImageUrl(
                                            booking.guide?.main_image
                                        );

                                    const touristImage =
                                        getImageUrl(
                                            booking.tourist?.photo
                                        );

                                    return (
                                        <tr
                                            key={booking.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            {/* Guide */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">

                                                    {guideImage ? (
                                                        <img
                                                            src={guideImage}
                                                            alt={booking.guide?.name || 'Guide'}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                                                            <HiBriefcase />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {booking.guide?.name || '-'}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            #{booking.guide?.id || '-'}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* Tourist */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">

                                                    {touristImage ? (
                                                        <img
                                                            src={touristImage}
                                                            alt={booking.tourist?.name || 'Tourist'}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                            <HiUser />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {booking.tourist?.name || '-'}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {booking.tourist?.email || '-'}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {booking.booking_date || '-'}
                                            </td>

                                            {/* Time */}
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {booking.start_time || '-'}
                                                {' - '}
                                                {booking.end_time || '-'}
                                            </td>

                                            {/* City */}
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {booking.guide?.city || '-'}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        booking.status
                                                    )}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">

                                                    <Link
                                                        to={`/guide-bookings/${booking.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                                                    >
                                                        <HiEye className="text-base" />
                                                        View
                                                    </Link>

                                                    {![
                                                        'cancelled',
                                                        'canceled',
                                                        'completed',
                                                        'rejected',
                                                    ].includes(
                                                        booking.status
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCancel(
                                                                    booking.id
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                                                        >
                                                            <HiXMark className="text-base" />
                                                            Cancel
                                                        </button>
                                                    )}

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            )}

                        </tbody>

                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                        <p className="text-sm text-slate-500">
                            Page {meta.current_page} of {meta.last_page}
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={meta.current_page <= 1}
                                onClick={() =>
                                    fetchBookings(
                                        meta.current_page - 1
                                    )
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <HiChevronLeft />
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={
                                    meta.current_page >=
                                    meta.last_page
                                }
                                onClick={() =>
                                    fetchBookings(
                                        meta.current_page + 1
                                    )
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <HiChevronRight />
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

