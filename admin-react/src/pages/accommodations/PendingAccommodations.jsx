import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import accommodationService from '../../services/accommodationService';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    Eye,
    Clock,
    ChevronLeft,
    ChevronRight,
    Building2,
    User,
    MapPin,
    Users,
} from 'lucide-react';

export default function PendingAccommodations() {
    const [accommodations, setAccommodations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    const fetchPendingAccommodations = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const data =
                await accommodationService.getPendingAccommodations({
                    page: currentPage,
                });

            setAccommodations(data.accommodations ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                    'Failed to load pending accommodations.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingAccommodations(page);
    }, [page]);

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

    const columns = [
        {
            key: 'name',
            label: 'Accommodation',
            render: (accommodation) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                        <Building2 className="h-5 w-5 text-amber-600" />
                    </div>

                    <div>
                        <div className="font-medium text-slate-900">
                            {accommodation.name}
                        </div>

                        <div className="text-xs text-slate-400">
                            ID #{accommodation.id}
                        </div>
                    </div>
                </div>
            ),
        },

        {
            key: 'host',
            label: 'Host',
            render: (accommodation) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
                        <User className="h-4 w-4 text-indigo-600" />
                    </div>

                    <div>
                        <div className="font-medium text-slate-700">
                            {accommodation.host?.name ?? '-'}
                        </div>

                        <div className="text-xs text-slate-400">
                            {accommodation.host?.email ?? '-'}
                        </div>
                    </div>
                </div>
            ),
        },

        {
            key: 'city',
            label: 'City',
            render: (accommodation) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />

                    {accommodation.city?.name_en ??
                        accommodation.city?.name_ar ??
                        '-'}
                </div>
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
            key: 'capacity',
            label: 'Capacity',
            render: (accommodation) => (
                <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    {accommodation.capacity ?? 0}
                </div>
            ),
        },

        {
            key: 'price_range',
            label: 'Price',
            render: (accommodation) => (
                <span className="font-medium text-slate-700">
                    {accommodation.price_range ?? '-'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Pending Accommodations"
                subtitle="Review accommodation requests waiting for verification."
            />

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                        <Clock className="h-5 w-5 text-amber-700" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-amber-900">
                            Pending Verification
                        </h3>

                        <p className="mt-1 text-sm text-amber-800">
                            These accommodations are waiting for admin
                            review. Open an accommodation to inspect its
                            details before approving or rejecting it.
                        </p>
                    </div>
                </div>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">
                                Pending Requests
                            </p>

                            <p className="text-2xl font-semibold text-slate-800">
                                {meta?.total ?? accommodations.length}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <DataTable
                            columns={columns}
                            data={accommodations}
                            emptyMessage="No pending accommodations."
                            actions={(accommodation) => (
                                <div className="flex items-center justify-end">
                                    <Link
                                        to={`/accommodations/${accommodation.id}`}
                                    >
                                        <Button>
                                            <Eye className="mr-1.5 inline-block h-4 w-4" />
                                            Review
                                        </Button>
                                    </Link>
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
