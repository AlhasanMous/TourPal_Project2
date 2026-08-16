import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import accommodationBookingService from '../../services/accommodationBookingService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    ArrowLeft,
    CalendarDays,
    User,
    Building2,
    MapPin,
    BriefcaseBusiness,
    Clock,
} from 'lucide-react';

export default function AccommodationBookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const fetchBooking = async () => {
        setLoading(true);
        setError('');

        try {
            const data =
                await accommodationBookingService.getBookingById(id);

            setBooking(data.booking ?? null);
        } catch (err) {
            console.error('Failed to load booking details:', err);

            setError(
                err.response?.data?.message ??
                'Failed to load booking details.'
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';

        return new Date(date).toLocaleDateString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-amber-200';

            case 'confirmed':
            case 'accepted':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

            case 'rejected':
            case 'declined':
                return 'bg-rose-50 text-rose-700 ring-rose-200';

            case 'cancelled':
                return 'bg-slate-100 text-slate-600 ring-slate-200';

            default:
                return 'bg-slate-100 text-slate-600 ring-slate-200';
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader
                title="Accommodation Booking Details"
                subtitle="View booking information and related details."
            />

            <ErrorMessage message={error} />

            {booking && (
                <>
                    {/* Back */}
                    <div className="mb-6">
                        <Button
                            variant="secondary"
                            onClick={() =>
                                navigate('/accommodation-bookings')
                            }
                        >
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back to Bookings
                        </Button>
                    </div>

                    {/* Booking Overview */}
                    <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Booking ID
                                </p>

                                <h2 className="text-2xl font-semibold text-slate-900">
                                    #{booking.id}
                                </h2>
                            </div>

                            <span
                                className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${getStatusClass(
                                    booking.status
                                )}`}
                            >
                                {booking.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">

                        {/* Tourist */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-2">
                                    <User className="h-5 w-5 text-indigo-600" />
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900">
                                    Tourist
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Name
                                    </p>

                                    <p className="font-medium text-slate-800">
                                        {booking.tourist?.name ?? '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Email
                                    </p>

                                    <p className="text-slate-600">
                                        {booking.tourist?.email ?? '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Accommodation */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-50 p-2">
                                    <Building2 className="h-5 w-5 text-emerald-600" />
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900">
                                    Accommodation
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Name
                                    </p>

                                    <p className="font-medium text-slate-800">
                                        {booking.accommodation?.name ?? '-'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />

                                    <span className="text-slate-600">
                                        {booking.accommodation?.city ?? '-'}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Type
                                    </p>

                                    <p className="text-slate-600">
                                        {booking.accommodation?.type ?? '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Price Range
                                    </p>

                                    <p className="text-slate-600">
                                        {booking.accommodation?.price_range ?? '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-amber-50 p-2">
                                    <CalendarDays className="h-5 w-5 text-amber-600" />
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900">
                                    Booking Information
                                </h3>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Check-in
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {formatDate(booking.check_in)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Check-out
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {formatDate(booking.check_out)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Room Type
                                    </p>

                                    <p className="mt-1 font-medium capitalize text-slate-800">
                                        {booking.room_type ?? '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Created At
                                    </p>

                                    <p className="mt-1 font-medium text-slate-800">
                                        {formatDate(booking.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Workspace */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-violet-50 p-2">
                                    <BriefcaseBusiness className="h-5 w-5 text-violet-600" />
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900">
                                    Workspace
                                </h3>
                            </div>

                            {booking.workspace_id ? (
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Workspace ID
                                    </p>

                                    <p className="font-medium text-slate-800">
                                        #{booking.workspace_id}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No workspace associated with this booking.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Image */}
                    {booking.accommodation?.main_image && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                            <img
                                src={booking.accommodation.main_image}
                                alt={booking.accommodation.name}
                                className="h-80 w-full object-cover"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
