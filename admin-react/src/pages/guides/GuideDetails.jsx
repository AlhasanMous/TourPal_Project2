import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiBriefcase, HiMapPin, HiCalendarDays, HiStar, HiCheckCircle, HiXCircle } from 'react-icons/hi2';
import guideService from '../../services/guideService';
import RejectModal from './RejectModal';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function GuideDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const fetchGuide = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await guideService.getGuide(id);
            setGuide(data.guide ?? data);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to load guide.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuide();
    }, [id]);

    const handleVerify = async (action, reason = null) => {
        if (action === 'reject') {
            setShowRejectModal(true);
            return;
        }

        const confirmed = window.confirm(`Are you sure to ${action} this guide?`);
        if (!confirmed) return;

        try {
            await guideService.verifyGuide(id, action, reason);
            fetchGuide();
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to update guide.');
        }
    };

    const handleConfirmReject = async (reason) => {
        try {
            await guideService.verifyGuide(id, 'reject', reason);
            setShowRejectModal(false);
            fetchGuide();
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to reject guide.');
        }
    };

    if (loading) return <Loading />;

    const statusBgColor = guide?.verification_status === 'approved'
        ? 'bg-green-50 border-green-200'
        : guide?.verification_status === 'rejected'
            ? 'bg-red-50 border-red-200'
            : 'bg-yellow-50 border-yellow-200';

    const statusTextColor = guide?.verification_status === 'approved'
        ? 'text-green-700'
        : guide?.verification_status === 'rejected'
            ? 'text-red-700'
            : 'text-yellow-700';

    return (
        <div>
            <PageHeader
                title={(
                    <>
                        <HiBriefcase className="mr-3 inline-block align-middle text-3xl text-violet-600" />
                        {guide?.user?.name ?? 'Guide'}
                    </>
                )}
                subtitle="Guide profile and verification"
            />

            <ErrorMessage message={error} />

            <div className="space-y-6">
                {/* Main Info Card */}
                <div className={`rounded-2xl border-2 ${statusBgColor} p-6 shadow-sm`}>
                    <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            {guide?.main_image ? (
                                <img
                                    src={guide.main_image}
                                    alt={guide.user?.name}
                                    className="h-24 w-24 rounded-xl object-cover shadow-md"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-violet-200 to-indigo-200 text-3xl font-bold text-violet-700 shadow-md">
                                    {guide?.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                </div>
                            )}

                            <div className="flex-1">
                                <h2 className="mb-1 text-2xl font-bold text-slate-800">{guide?.user?.name}</h2>
                                <p className="mb-3 text-sm text-slate-600">{guide?.user?.email}</p>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                                        guide?.verification_status === 'approved'
                                            ? 'bg-green-100 text-green-700'
                                            : guide?.verification_status === 'rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {guide?.verification_status === 'approved' ? (
                                            <HiCheckCircle className="text-base" />
                                        ) : guide?.verification_status === 'rejected' ? (
                                            <HiXCircle className="text-base" />
                                        ) : (
                                            <HiCalendarDays className="text-base" />
                                        )}
                                        {guide?.verification_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* City */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <HiMapPin className="text-xl text-violet-600" />
                            <p className="text-sm font-medium text-slate-500">City</p>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-800">
                            {guide?.city?.name_en || guide?.city?.name_ar || guide?.city?.name || '-'}
                        </p>
                    </div>

                    {/* Stats - Bookings */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <HiCalendarDays className="text-xl text-emerald-600" />
                            <p className="text-sm font-medium text-slate-500">Bookings</p>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-800">{guide?.bookings_count ?? 0}</p>
                    </div>

                    {/* Stats - Reviews */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <HiStar className="text-xl text-amber-600" />
                            <p className="text-sm font-medium text-slate-500">Reviews</p>
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-800">{guide?.reviews_count ?? 0}</p>
                    </div>

                    {/* Languages/Bio */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">Specializations</p>
                        <p className="mt-2 text-base text-slate-700">
                            {Array.isArray(guide?.specializations) && guide.specializations.length > 0
                                ? guide.specializations.join(', ')
                                : 'Not specified'}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-slate-800">Verification Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        {guide?.verification_status !== 'approved' && (
                            <Button
                                variant="secondary"
                                onClick={() => handleVerify('verify')}
                                className="flex items-center gap-2"
                            >
                                <HiCheckCircle className="text-lg" />
                                Approve Guide
                            </Button>
                        )}

                        {guide?.verification_status !== 'rejected' && (
                            <Button
                                variant="secondary"
                                onClick={() => handleVerify('reject')}
                                className="flex items-center gap-2"
                            >
                                <HiXCircle className="text-lg" />
                                Reject Guide
                            </Button>
                        )}

                        <Button
                            variant="secondary"
                            onClick={() => navigate('/guides')}
                            className="flex items-center gap-2"
                        >
                            Back to Guides
                        </Button>
                    </div>
                </div>
            </div>

            <RejectModal
                isOpen={showRejectModal}
                onCancel={() => setShowRejectModal(false)}
                onConfirm={handleConfirmReject}
            />
        </div>
    );
}
