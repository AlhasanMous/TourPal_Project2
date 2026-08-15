import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import guideService from '../../services/guideService';
import RejectModal from './RejectModal';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function GuideDetails() {
    const { id } = useParams();

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

    return (
        <div>
            <PageHeader title={`Guide: ${guide?.user?.name ?? id}`} subtitle="Guide details" />

            <ErrorMessage message={error} />

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4">
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-gray-600">{guide?.user?.email}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <div className="text-xs text-gray-500">City</div>
                        <div className="font-medium">{guide?.city?.name ?? '-'}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Verification</div>
                        <div className="font-medium">{guide?.verification_status ?? '-'}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Bookings</div>
                        <div className="font-medium">{guide?.bookings_count ?? 0}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Reviews</div>
                        <div className="font-medium">{guide?.reviews_count ?? 0}</div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    {guide?.verification_status !== 'verified' && (
                        <Button variant="secondary" onClick={() => handleVerify('verify')}>Verify</Button>
                    )}

                    {guide?.verification_status !== 'rejected' && (
                        <Button variant="secondary" onClick={() => handleVerify('reject')}>Reject</Button>
                    )}
                    <Link to={`/guides/${id}/edit`}>
                        <Button variant="secondary">Edit</Button>
                    </Link>
                </div>

                <RejectModal
                    isOpen={showRejectModal}
                    onCancel={() => setShowRejectModal(false)}
                    onConfirm={handleConfirmReject}
                />
            </div>
        </div>
    );
}
