import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    HiArrowLeft,
    HiCalendarDays,
    HiClock,
    HiMapPin,
    HiUser,
    HiBriefcase,
    HiXMark,
} from 'react-icons/hi2';

import guideBookingService from '../../services/guideBookingService';
import Loading from '../../components/common/Loading';

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-emerald-50 text-emerald-700',
    accepted: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-blue-50 text-blue-700',
    cancelled: 'bg-rose-50 text-rose-700',
    canceled: 'bg-rose-50 text-rose-700',
    rejected: 'bg-red-50 text-red-700',
};

const getImageUrl = (path) => {
    if (!path) return null;

    if (
        path.startsWith('http://') ||
        path.startsWith('https://')
    ) {
        return path;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
};

export default function GuideBookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBooking = async () => {
        try {
            setLoading(true);
            setError('');

            const response =
                await guideBookingService.getBooking(id);

            setBooking(
                response?.booking ??
                response?.data ??
                response
            );
        } catch (err) {
            console.error('Guide booking details error:', err);

            setError(
                err.response?.data?.message ||
                'Failed to load booking details.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const handleCancel = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to cancel this booking?'
        );

        if (!confirmed) return;

        try {
            await guideBookingService.cancelBooking(id);

            await fetchBooking();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                'Failed to cancel the booking.'
            );
        }
    };

    if (loading) {
        return <Loading message="Loading booking details..." />;
    }

    if (error) {
        return (
            <div className="space-y-4">
                <Link
                    to="/guide-bookings"
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <HiArrowLeft />
                    Back to Guide Bookings
                </Link>

                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-slate-500">
                    Booking not found.
                </p>
            </div>
        );
    }

    const guideImage =
        getImageUrl(booking.guide?.main_image);

    const touristImage =
        getImageUrl(booking.tourist?.photo);

    const canCancel = ![
        'cancelled',
        'canceled',
        'completed',
        'rejected',
    ].includes(booking.status);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <Link
                        to="/guide-bookings"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        <HiArrowLeft />
                        Back to Guide Bookings
                    </Link>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Booking #{booking.id}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Guide booking details
                    </p>
                </div>

                <span
                    className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                        statusStyles[booking.status] ||
                        'bg-slate-100 text-slate-600'
                    }`}
                >
                    {booking.status || '-'}
                </span>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Guide */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center gap-2">
                        <HiBriefcase className="text-xl text-violet-600" />

                        <h2 className="text-lg font-semibold text-slate-800">
                            Guide
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">

                        {guideImage ? (
                            <img
                                src={guideImage}
                                alt={booking.guide?.name || 'Guide'}
                                className="h-20 w-20 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-600">
                                <HiBriefcase />
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                {booking.guide?.name || '-'}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {booking.guide?.city || '-'}
                            </p>
                        </div>

                    </div>

                    {booking.guide?.specializations && (
                        <div className="mt-5">
                            <p className="mb-2 text-sm font-medium text-slate-500">
                                Specializations
                            </p>

                            <p className="text-sm text-slate-700">
                                {Array.isArray(
                                    booking.guide.specializations
                                )
                                    ? booking.guide.specializations.join(
                                        ', '
                                    )
                                    : booking.guide.specializations}
                            </p>
                        </div>
                    )}

                </div>

                {/* Tourist */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center gap-2">
                        <HiUser className="text-xl text-emerald-600" />

                        <h2 className="text-lg font-semibold text-slate-800">
                            Tourist
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">

                        {touristImage ? (
                            <img
                                src={touristImage}
                                alt={booking.tourist?.name || 'Tourist'}
                                className="h-20 w-20 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-600">
                                <HiUser />
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                {booking.tourist?.name || '-'}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {booking.tourist?.email || '-'}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Booking Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-5 text-lg font-semibold text-slate-800">
                    Booking Information
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <HiCalendarDays className="text-xl" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Booking Date
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {booking.booking_date || '-'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            <HiClock className="text-xl" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Time
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {booking.start_time || '-'}
                                {' - '}
                                {booking.end_time || '-'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <HiMapPin className="text-xl" />
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                City
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                {booking.guide?.city || '-'}
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={() => navigate('/guide-bookings')}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    Back
                </button>

                {canCancel && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                        <HiXMark />
                        Cancel Booking
                    </button>
                )}

            </div>

        </div>
    );
}

