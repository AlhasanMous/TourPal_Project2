import { useEffect, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import reviewService from '../../services/reviewService';

export default function ReviewsList() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    // =========================================================
    // Load Reviews
    // =========================================================
    const fetchReviews = async (currentPage = 1) => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
            };

            if (type) {
                params.type = type;
            }

            const data = await reviewService.getReviews(params);

            setReviews(data.reviews ?? []);
            setMeta(data.meta ?? null);
        } catch (err) {
            console.error('Failed to load reviews:', err);

            setError(
                err.response?.data?.message ??
                'Failed to load reviews.'
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // Initial load + filters + pagination
    // =========================================================
    useEffect(() => {
        fetchReviews(page);
    }, [page, type]);

    // =========================================================
    // Filter change
    // =========================================================
    const handleTypeChange = (e) => {
        setType(e.target.value);

        // عند تغيير الفلتر نرجع للصفحة الأولى
        setPage(1);
    };

    // =========================================================
    // Delete Review
    // =========================================================
    const handleDelete = async (review) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete this review?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await reviewService.deleteReview(review.id);

            // إذا حذفنا آخر عنصر في الصفحة الحالية
            // وكان هناك صفحات سابقة، نرجع صفحة للخلف
            if (
                reviews.length === 1 &&
                page > 1
            ) {
                setPage((prev) => prev - 1);
            } else {
                fetchReviews(page);
            }
        } catch (err) {
            console.error('Failed to delete review:', err);

            setError(
                err.response?.data?.message ??
                'Failed to delete review.'
            );
        }
    };

    // =========================================================
    // Helpers
    // =========================================================
    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString();
    };

    const getTypeLabel = (review) => {
        const type = review.reviewable_type ?? '';

        if (type.includes('Place') || type === 'place') {
            return 'Place';
        }

        if (type.includes('Guide') || type === 'guide') {
            return 'Guide';
        }

        if (
            type.includes('Accommodation') ||
            type === 'accommodation'
        ) {
            return 'Accommodation';
        }

        return type || '-';
    };

    const getRatingStars = (rating) => {
        const value = Number(rating) || 0;

        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={
                            star <= value
                                ? 'text-amber-400'
                                : 'text-slate-300'
                        }
                    >
                        ★
                    </span>
                ))}

                <span className="ml-1 text-xs text-slate-500">
                    {value}/5
                </span>
            </div>
        );
    };

    // =========================================================
    // IMPORTANT:
    // API returns:
    // profile-photos/example.svg
    //
    // Laravel public storage should normally be:
    // /storage/profile-photos/example.svg
    // =========================================================
    const getProfilePhotoUrl = (photo) => {
        if (!photo) {
            return null;
        }

        // إذا الـ API رجع رابط كامل
        if (
            photo.startsWith('http://') ||
            photo.startsWith('https://')
        ) {
            return photo;
        }

        // إذا رجع /storage/...
        if (photo.startsWith('/storage/')) {
            return photo;
        }

        // إذا رجع storage/...
        if (photo.startsWith('storage/')) {
            return `/${photo}`;
        }

        // إذا رجع فقط:
        // profile-photos/example.svg
        return `/storage/${photo}`;
    };

    const getInitials = (name) => {
        if (!name) {
            return '?';
        }

        return name
            .split(' ')
            .filter(Boolean)
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // =========================================================
    // Table Columns
    // =========================================================
    const columns = [
        {
            key: 'reviewer',
            label: 'Reviewer',

            render: (review) => {
                const reviewer = review.reviewer;
                const photoUrl = getProfilePhotoUrl(
                    reviewer?.photo
                );

                return (
                    <div className="flex items-center gap-3">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={reviewer?.name ?? 'Reviewer'}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                                onError={(e) => {
                                    e.currentTarget.style.display =
                                        'none';
                                    e.currentTarget.nextElementSibling?.classList.remove(
                                        'hidden'
                                    );
                                }}
                            />
                        ) : null}

                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700 ring-2 ring-indigo-100 ${
                                photoUrl ? 'hidden' : ''
                            }`}
                        >
                            {getInitials(reviewer?.name)}
                        </div>

                        <div>
                            <div className="font-medium text-slate-900">
                                {reviewer?.name ?? '-'}
                            </div>

                            <div className="text-xs text-slate-400">
                                ID: {reviewer?.id ?? '-'}
                            </div>
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'rating',
            label: 'Rating',

            render: (review) => (
                <div>
                    {getRatingStars(review.rating)}
                </div>
            ),
        },

        {
            key: 'content',
            label: 'Review',

            render: (review) => (
                <div className="max-w-md">
                    <p className="truncate text-sm text-slate-600">
                        {review.content || 'No comment'}
                    </p>
                </div>
            ),
        },

        {
            key: 'reviewable_type',
            label: 'Type',

            render: (review) => (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    {getTypeLabel(review)}
                </span>
            ),
        },

        {
            key: 'reviewable_id',
            label: 'Entity ID',

            render: (review) => (
                <span className="font-medium text-slate-700">
                    #{review.reviewable_id ?? '-'}
                </span>
            ),
        },

        {
            key: 'created_at',
            label: 'Created',

            render: (review) => (
                <span className="text-sm text-slate-500">
                    {formatDate(review.created_at)}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Reviews"
                subtitle="Manage and monitor TourPal reviews."
            />

            {/* =====================================================
                Statistics
            ====================================================== */}
            {meta && (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Reviews
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {meta.total ?? 0}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Current Page
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {meta.current_page ?? 1}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Per Page
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {meta.per_page ?? 20}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Pages
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                            {meta.last_page ?? 1}
                        </p>
                    </div>
                </div>
            )}

            {/* =====================================================
                Filters
            ====================================================== */}
            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="md:w-64">
                        <label
                            htmlFor="review-type"
                            className="mb-1 block text-sm font-medium text-slate-600"
                        >
                            Review Type
                        </label>

                        <select
                            id="review-type"
                            value={type}
                            onChange={handleTypeChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                All types
                            </option>

                            <option value="place">
                                Places
                            </option>

                            <option value="guide">
                                Guides
                            </option>

                            <option value="accommodation">
                                Accommodations
                            </option>
                        </select>
                    </div>

                    {type && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setType('');
                                setPage(1);
                            }}
                        >
                            Clear Filter
                        </Button>
                    )}
                </div>
            </div>

            {/* =====================================================
                Error
            ====================================================== */}
            <ErrorMessage message={error} />

            {/* =====================================================
                Loading / Table
            ====================================================== */}
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <DataTable
                            columns={columns}
                            data={reviews}
                            emptyMessage="No reviews found."
                            actions={(review) => (
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDelete(review)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    {/* =================================================
                        Pagination
                    ================================================== */}
                    {meta && meta.last_page > 1 && (
                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                                    disabled={
                                        loading ||
                                        meta.current_page <= 1
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                Math.max(
                                                    1,
                                                    prev - 1
                                                )
                                        )
                                    }
                                >
                                    Previous
                                </Button>

                                <Button
                                    variant="secondary"
                                    disabled={
                                        loading ||
                                        meta.current_page >=
                                            meta.last_page
                                    }
                                    onClick={() =>
                                        setPage(
                                            (prev) =>
                                                Math.min(
                                                    meta.last_page,
                                                    prev + 1
                                                )
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
