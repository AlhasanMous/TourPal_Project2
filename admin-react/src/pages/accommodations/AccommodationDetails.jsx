import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import accommodationService from '../../services/accommodationService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    Users,
    Star,
    XCircle,
    CalendarCheck,
} from 'lucide-react';

export default function AccommodationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [accommodation, setAccommodation] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [actionLoading, setActionLoading] = useState(false);

    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchAccommodation = async () => {
        setLoading(true);
        setError('');

        try {
            const data =
                await accommodationService.getAccommodation(id);

            setAccommodation(data.accommodation ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    'Failed to load accommodation.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccommodation();
    }, [id]);

    const handleApprove = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to approve this accommodation?'
        );

        if (!confirmed) {
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            const data =
                await accommodationService.verifyAccommodation(
                    id,
                    {
                        action: 'verify',
                    }
                );

            setAccommodation(
                data.accommodation ?? accommodation
            );
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    'Failed to approve accommodation.'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();

        if (!rejectionReason.trim()) {
            setError(
                'Please enter a rejection reason before rejecting the accommodation.'
            );
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            const data =
                await accommodationService.verifyAccommodation(
                    id,
                    {
                        action: 'reject',
                        rejection_reason:
                            rejectionReason.trim(),
                    }
                );

            setAccommodation(
                data.accommodation ?? accommodation
            );

            setShowRejectForm(false);
            setRejectionReason('');
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    'Failed to reject accommodation.'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

            case 'rejected':
                return 'bg-rose-50 text-rose-700 ring-rose-200';

            default:
                return 'bg-amber-50 text-amber-700 ring-amber-200';
        }
    };

    const getStatusDotClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-500';

            case 'rejected':
                return 'bg-rose-500';

            default:
                return 'bg-amber-500';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved';

            case 'rejected':
                return 'Rejected';

            default:
                return 'Pending';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'hotel':
                return 'Hotel';

            case 'hostel':
                return 'Hostel';

            case 'shared':
                return 'Shared';

            default:
                return type ?? '-';
        }
    };

    if (loading) {
        return (
            <div>
                <PageHeader
                    title="Accommodation Details"
                    subtitle="View accommodation information."
                />

                <Loading />
            </div>
        );
    }

    if (!accommodation) {
        return (
            <div>
                <PageHeader
                    title="Accommodation Details"
                    subtitle="View accommodation information."
                />

                <ErrorMessage
                    message={
                        error ||
                        'Accommodation not found.'
                    }
                />

                <Link to="/accommodations">
                    <Button variant="secondary">
                        <ArrowLeft className="mr-1.5 inline-block h-4 w-4" />
                        Back to Accommodations
                    </Button>
                </Link>
            </div>
        );
    }

    const isPending =
        accommodation.verification_status === 'pending';

    return (
        <div>
            <PageHeader
                title={accommodation.name}
                subtitle="Review accommodation details and verification status."
            />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link to="/accommodations">
                    <Button variant="secondary">
                        <ArrowLeft className="mr-1.5 inline-block h-4 w-4" />
                        Back to Accommodations
                    </Button>
                </Link>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${getStatusClass(
                        accommodation.verification_status
                    )}`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${getStatusDotClass(
                            accommodation.verification_status
                        )}`}
                    />

                    {getStatusLabel(
                        accommodation.verification_status
                    )}
                </span>
            </div>

            <ErrorMessage message={error} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Main Information */}
                <div className="space-y-6 xl:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                                    <Building2 className="h-5 w-5 text-indigo-600" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">
                                        Accommodation Information
                                    </h2>

                                    <p className="text-sm text-slate-400">
                                        Basic information about this accommodation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Name
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {accommodation.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Type
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {getTypeLabel(
                                        accommodation.type
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    City
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 font-medium text-slate-800">
                                    <MapPin className="h-4 w-4 text-slate-400" />

                                    {accommodation.city?.name_en ??
                                        accommodation.city?.name_ar ??
                                        '-'}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Capacity
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 font-medium text-slate-800">
                                    <Users className="h-4 w-4 text-slate-400" />

                                    {accommodation.capacity}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Price Range
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {accommodation.price_range ??
                                        '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Created
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 font-medium text-slate-800">
                                    <CalendarDays className="h-4 w-4 text-slate-400" />

                                    {formatDate(
                                        accommodation.created_at
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Accommodation Image
                            </h2>
                        </div>

                        <div className="p-6">
                            {accommodation.main_image ? (
                                <img
                                    src={
                                        accommodation.main_image
                                    }
                                    alt={
                                        accommodation.name
                                    }
                                    className="h-72 w-full rounded-xl object-cover"
                                />
                            ) : (
                                <div className="flex h-72 w-full flex-col items-center justify-center rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200">
                                    <Building2 className="h-12 w-12 text-slate-300" />

                                    <p className="mt-3 text-sm text-slate-400">
                                        No main image available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rejection Reason */}
                    {accommodation.rejection_reason && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                            <div className="flex gap-3">
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />

                                <div>
                                    <h3 className="font-semibold text-rose-800">
                                        Rejection Reason
                                    </h3>

                                    <p className="mt-1 text-sm text-rose-700">
                                        {
                                            accommodation.rejection_reason
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Host */}
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-slate-800">
                            Host Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Name
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {accommodation.host?.name ??
                                        '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Email
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />

                                    {accommodation.host?.email ??
                                        '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-slate-800">
                            Statistics
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-indigo-50 p-4">
                                <CalendarCheck className="h-5 w-5 text-indigo-600" />

                                <p className="mt-3 text-2xl font-semibold text-indigo-900">
                                    {accommodation.bookings_count ??
                                        0}
                                </p>

                                <p className="text-xs text-indigo-700">
                                    Bookings
                                </p>
                            </div>

                            <div className="rounded-xl bg-amber-50 p-4">
                                <Star className="h-5 w-5 text-amber-600" />

                                <p className="mt-3 text-2xl font-semibold text-amber-900">
                                    {accommodation.reviews_count ??
                                        0}
                                </p>

                                <p className="text-xs text-amber-700">
                                    Reviews
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Verification */}
                    {isPending && (
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <h2 className="mb-2 text-lg font-semibold text-slate-800">
                                Verification
                            </h2>

                            <p className="mb-5 text-sm text-slate-500">
                                Review this accommodation and
                                decide whether it should be
                                approved or rejected.
                            </p>

                            {!showRejectForm ? (
                                <div className="space-y-3">
                                    <Button
                                        className="w-full justify-center"
                                        onClick={
                                            handleApprove
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />

                                        {actionLoading
                                            ? 'Processing...'
                                            : 'Approve Accommodation'}
                                    </Button>

                                    <Button
                                        variant="danger"
                                        className="w-full justify-center"
                                        onClick={() =>
                                            setShowRejectForm(
                                                true
                                            )
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />

                                        Reject Accommodation
                                    </Button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={
                                        handleReject
                                    }
                                >
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Rejection Reason
                                    </label>

                                    <textarea
                                        value={
                                            rejectionReason
                                        }
                                        onChange={(e) =>
                                            setRejectionReason(
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        placeholder="Explain why this accommodation is being rejected..."
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                                    />

                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            type="submit"
                                            variant="danger"
                                            disabled={
                                                actionLoading ||
                                                !rejectionReason.trim()
                                            }
                                        >
                                            <XCircle className="mr-1.5 h-4 w-4" />

                                            {actionLoading
                                                ? 'Rejecting...'
                                                : 'Confirm Reject'}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                setShowRejectForm(
                                                    false
                                                );
                                                setRejectionReason(
                                                    ''
                                                );
                                                setError('');
                                            }}
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Verification Information */}
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">
                            Verification Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Status
                                </p>

                                <p className="mt-1 font-medium text-slate-700">
                                    {getStatusLabel(
                                        accommodation.verification_status
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Verified At
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    {formatDate(
                                        accommodation.verified_at
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
