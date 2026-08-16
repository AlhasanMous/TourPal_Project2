import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import accommodationBookingService from '../../services/accommodationBookingService';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    Search as SearchIcon,
    Eye,
    XCircle,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
} from 'lucide-react';

export default function AccommodationBookingsList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchBookings = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (status) {
                params.status = status;
            }

            /*
             * ملاحظة:
             * الـ Backend الحالي يدعم status و accommodation_id
             * و tourist_id حسب الـ Controller.
             *
             * search غير مستخدم حالياً حتى لا نرسل parameter
             * غير مدعوم من الـ Backend.
             */

            const data =
                await accommodationBookingService.getBookings(params);

            let result = data.bookings ?? [];

            /*
             * البحث بالواجهة مؤقتاً على البيانات الموجودة في الصفحة.
             * عندما يضيف Backend search يمكن نقله للـ API.
             */
            if (search.trim()) {
                const term = search.trim().toLowerCase();

                result = result.filter((booking) => {
                    const touristName =
                        booking.tourist?.name?.toLowerCase() ?? '';

                    const touristEmail =
                        booking.tourist?.email?.toLowerCase() ?? '';

                    const accommodationName =
                        booking.accommodation?.name?.toLowerCase() ?? '';

                    return (
                        touristName.includes(term) ||
                        touristEmail.includes(term) ||
                        accommodationName.includes(term)
                    );
                });
            }

            setBookings(result);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load accommodation bookings.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(page);
    }, [page, status]);

    const handleSearch = (e) => {
        e.preventDefault();

        /*
         * البحث الحالي يتم على البيانات التي تم تحميلها.
         * لذلك نعيد تحميل الصفحة الحالية فقط.
         */
        fetchBookings(page);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handleCancel = async (booking) => {
        const confirmed = window.confirm(
            `Are you sure you want to cancel booking #${booking.id}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await accommodationBookingService.cancelBooking(
                booking.id
            );

            fetchBookings(page);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to cancel booking.'
            );
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const getStatusClass = (bookingStatus) => {
        switch (bookingStatus) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-amber-200';

            case 'accepted':
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

            case 'declined':
            case 'rejected':
                return 'bg-rose-50 text-rose-700 ring-rose-200';

            case 'cancelled':
                return 'bg-slate-100 text-slate-600 ring-slate-200';

            default:
                return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
        }
    };

    const getStatusLabel = (bookingStatus) => {
        switch (bookingStatus) {
            case 'pending':
                return 'Pending';

            case 'accepted':
                return 'Accepted';

            case 'confirmed':
                return 'Confirmed';

            case 'declined':
                return 'Declined';

            case 'rejected':
                return 'Rejected';

            case 'cancelled':
                return 'Cancelled';

            default:
                return bookingStatus ?? '-';
        }
    };

    const getRoomTypeLabel = (roomType) => {
        switch (roomType) {
            case 'private':
                return 'Private';

            case 'shared':
                return 'Shared';

            default:
                return roomType ?? '-';
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'Booking ID',
            render: (booking) => (
                <span className="font-medium text-slate-700">
                    #{booking.id}
                </span>
            ),
        },

        {
            key: 'tourist',
            label: 'Tourist',
            render: (booking) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {booking.tourist?.name ?? '-'}
                    </div>

                    <div className="text-xs text-slate-400">
                        {booking.tourist?.email ?? '-'}
                    </div>
                </div>
            ),
        },

        {
            key: 'accommodation',
            label: 'Accommodation',
            render: (booking) => (
                <div>
                    <div className="font-medium text-slate-700">
                        {booking.accommodation?.name ?? '-'}
                    </div>

                    <div className="text-xs text-slate-400">
                        {booking.accommodation?.city ?? '-'}
                    </div>
                </div>
            ),
        },

        {
            key: 'check_in',
            label: 'Check-in',
            render: (booking) => (
                <span className="text-slate-500">
                    {formatDate(booking.check_in)}
                </span>
            ),
        },

        {
            key: 'check_out',
            label: 'Check-out',
            render: (booking) => (
                <span className="text-slate-500">
                    {formatDate(booking.check_out)}
                </span>
            ),
        },

        {
            key: 'room_type',
            label: 'Room Type',
            render: (booking) => (
                <span className="text-slate-600">
                    {getRoomTypeLabel(booking.room_type)}
                </span>
            ),
        },

        {
            key: 'status',
            label: 'Status',
            render: (booking) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
                        booking.status
                    )}`}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />

                    {getStatusLabel(booking.status)}
                </span>
            ),
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (booking) => (
                <span className="text-slate-500">
                    {formatDate(booking.created_at)}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Accommodation Bookings"
                subtitle="Monitor and manage accommodation bookings."
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
                            placeholder="Search by tourist or accommodation..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="md:w-52">
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

                            <option value="confirmed">
                                Confirmed
                            </option>

                            <option value="accepted">
                                Accepted
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                            <option value="declined">
                                Declined
                            </option>

                            <option value="cancelled">
                                Cancelled
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
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <DataTable
                            columns={columns}
                            data={bookings}
                            emptyMessage="No accommodation bookings found."
                            actions={(booking) => (
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <Link
                                        to={`/accommodation-bookings/${booking.id}`}
                                    >
                                        <Button variant="secondary">
                                            <Eye className="mr-1.5 inline-block h-4 w-4 text-slate-600" />
                                            View
                                        </Button>
                                    </Link>

                                    {booking.status !== 'cancelled' && (
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                handleCancel(booking)
                                            }
                                        >
                                            <XCircle className="mr-1.5 inline-block h-4 w-4" />
                                            Cancel
                                        </Button>
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
                                        setPage((prev) => prev - 1)
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
                                        setPage((prev) => prev + 1)
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
