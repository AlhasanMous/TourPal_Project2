import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import guideService from '../../services/guideService';
import RejectModal from './RejectModal';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

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

    const fetchGuides = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = { page: currentPage };

            if (search.trim()) params.search = search.trim();
            if (status) params.status = status;

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
        fetchGuides(page);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (page !== 1) setPage(1);
        else fetchGuides(1);
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

    const columns = [
        {
            key: 'name',
            label: 'Guide',
            render: (g) => (
                <div className="flex items-center gap-3">
                    {g.user?.profile_photo ? (
                        <img src={g.user.profile_photo} alt={g.user.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                            {g.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                    )}

                    <div>
                        <div className="font-medium text-gray-900">{g.user?.name}</div>
                        <div className="text-xs text-gray-500">{g.user?.email}</div>
                    </div>
                </div>
            ),
        },

        {
            key: 'city',
            label: 'City',
            render: (g) => g.city?.name ?? '-',
        },

        {
            key: 'verification',
            label: 'Verification',
            render: (g) => (
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${g.verification_status === 'verified' ? 'bg-green-100 text-green-700' : g.verification_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {g.verification_status ?? '-'}
                </span>
            ),
        },

        {
            key: 'bookings',
            label: 'Bookings',
            render: (g) => g.bookings_count ?? 0,
        },

        {
            key: 'reviews',
            label: 'Reviews',
            render: (g) => g.reviews_count ?? 0,
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (g) => formatDate(g.created_at),
        },
    ];

    return (
        <div>
            <PageHeader title="Guides" subtitle="Manage tour guides." />

            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <Input label="Search" type="text" placeholder="Search by guide name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="md:w-48">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All</option>
                            <option value="pending">pending</option>
                            <option value="verified">verified</option>
                            <option value="rejected">rejected</option>
                        </select>
                    </div>

                    <Button type="submit">Search</Button>
                </form>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <DataTable columns={columns} data={guides} emptyMessage="No guides found." actions={(g) => (
                        <div className="flex items-center justify-end gap-2">
                            {g.verification_status !== 'verified' && (
                                <Button variant="secondary" onClick={() => handleVerify(g, 'verify')}>Verify</Button>
                            )}

                            {g.verification_status !== 'rejected' && (
                                <Button variant="secondary" onClick={() => handleVerify(g, 'reject')}>Reject</Button>
                            )}

                            <Link to={`/guides/${g.id}/edit`}>
                                <Button variant="secondary">Edit</Button>
                            </Link>

                            <Link to={`/guides/${g.id}`}>
                                <Button variant="secondary">View</Button>
                            </Link>
                        </div>
                    )} />

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
                            <p className="text-sm text-gray-600">Page {meta.current_page} of {meta.last_page} ({meta.total} total)</p>

                            <div className="flex gap-2">
                                <Button variant="secondary" disabled={meta.current_page <= 1} onClick={() => setPage((prev) => prev - 1)}>Previous</Button>

                                <Button variant="secondary" disabled={meta.current_page >= meta.last_page} onClick={() => setPage((prev) => prev + 1)}>Next</Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
