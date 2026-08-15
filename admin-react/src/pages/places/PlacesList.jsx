import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import placeService from '../../services/placeService';

import {
    Search as SearchIcon,
    Tag,
    ArrowUpDown,
    MapPin,
    Star,
    Clock,
    Pencil,
    Trash2,
    ImageOff,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function PlacesList() {
    const [places, setPlaces] = useState([]);


    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    const [search, setSearch] = useState('');
    const [cityId, setCityId] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPlaces = async (page = 1) => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page,
            };

            if (cityId) {
                params.city_id = cityId;
            }

            if (category) {
                params.category = category;
            }

            if (sort) {
                params.sort = sort;
            }

            const data = await placeService.getPlaces(params);

            setPlaces(data.places ?? []);

            setMeta(
                data.meta ?? {
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 0,
                }
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Failed to load places. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces(1);
    }, [cityId, category, sort]);

    const handleDelete = async (place) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${place.name_en}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');

            await placeService.deletePlace(place.id);

            const remainingPlaces = places.filter(
                (item) => item.id !== place.id
            );

            setPlaces(remainingPlaces);

            if (remainingPlaces.length === 0 && meta.current_page > 1) {
                fetchPlaces(meta.current_page - 1);
            } else {
                setMeta((current) => ({
                    ...current,
                    total: Math.max(0, current.total - 1),
                }));
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Failed to delete the place. Please try again.'
            );
        }
    };

    // Search is currently performed on the current page.
    // Backend does not provide a search parameter yet.
    const filteredPlaces = places.filter((place) => {
        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            return true;
        }

        return [
            place.name_ar,
            place.name_en,
            place.category,
            place.city?.name_ar,
            place.city?.name_en,
        ].some((value) =>
            String(value ?? '')
                .toLowerCase()
                .includes(searchTerm)
        );
    });

    // purely visual — category label -> accent color, cosmetic only
    const categoryBadgeClass = (cat) => {
        const key = String(cat ?? '').toLowerCase();

        if (key.includes('historic')) return 'bg-amber-50 text-amber-700 ring-amber-200';
        if (key.includes('beach')) return 'bg-sky-50 text-sky-700 ring-sky-200';
        if (key.includes('nature')) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
        return 'bg-indigo-50 text-indigo-700 ring-indigo-200';
    };

    const columns = [
        {
            key: 'main_image',
            label: 'Image',
            render: (place) =>
                place.main_image ? (
                    <img
                        src={place.main_image}
                        alt={place.name_en}
                        className="h-12 w-16 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                ) : (
                    <div className="flex h-12 w-16 flex-col items-center justify-center gap-0.5 rounded-lg bg-slate-100 text-slate-400">
                        <ImageOff className="h-4 w-4" />
                        <span className="text-[10px]">No Image</span>
                    </div>
                ),
        },
        {
            key: 'name_en',
            label: 'Name',
            render: (place) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {place.name_en}
                    </div>

                    <div className="text-sm text-slate-400">
                        {place.name_ar}
                    </div>
                </div>
            ),
        },
        {
            key: 'city',
            label: 'City',
            render: (place) => (
                <span className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {place.city?.name_en || place.city?.name_ar || '-'}
                </span>
            ),
        },
        {
            key: 'category',
            label: 'Category',
            render: (place) =>
                place.category ? (
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${categoryBadgeClass(place.category)}`}
                    >
                        <Tag className="h-3 w-3" />
                        {place.category}
                    </span>
                ) : (
                    <span className="text-slate-300">-</span>
                ),
        },
        {
            key: 'avg_rating',
            label: 'Rating',
            render: (place) => (
                <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {place.avg_rating ?? '0.00'}
                </span>
            ),
        },
        {
            key: 'visit_duration_hours',
            label: 'Duration',
            render: (place) => (
                <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {`${place.visit_duration_hours ?? 0} h`}
                </span>
            ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Places"
                subtitle="Manage tourist places available in TourPal."
                actionLabel="Add Place"
                actionTo="/places/create"
            />

            <ErrorMessage message={error} />

            <div className="mb-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label
                            htmlFor="place-search"
                            className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600"
                        >
                            <SearchIcon className="h-3.5 w-3.5 text-slate-400" />
                            Search
                        </label>

                        <input
                            id="place-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, city, or category..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="place-category"
                            className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600"
                        >
                            <Tag className="h-3.5 w-3.5 text-slate-400" />
                            Category
                        </label>

                        <input
                            id="place-category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Filter by category..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="place-sort"
                            className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600"
                        >
                            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                            Sort
                        </label>

                        <select
                            id="place-sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Default</option>
                            <option value="name_asc">Name A-Z</option>
                            <option value="name_desc">Name Z-A</option>
                            <option value="rating_desc">
                                Highest Rating
                            </option>
                            <option value="rating_asc">
                                Lowest Rating
                            </option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                        Showing {filteredPlaces.length} of {meta.total} places
                    </span>

                    {(search || category || sort) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setCategory('');
                                setSort('');
                            }}
                            className="flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                            <XCircle className="h-3.5 w-3.5" />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <Loading message="Loading places..." />
            ) : (
                <>
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                        <DataTable
                            columns={columns}
                            data={filteredPlaces}
                            emptyMessage={
                                search || category
                                    ? 'No places match your filters.'
                                    : 'No places found.'
                            }
                            actions={(place) => (
                                <div className="flex justify-end gap-2">
                                    <Link to={`/places/${place.id}/edit`}>
                                        <Button variant="secondary">
                                            <Pencil className="mr-1.5 inline-block h-4 w-4 text-indigo-600" />
                                            Edit
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            handleDelete(place)
                                        }
                                    >
                                        <Trash2 className="mr-1.5 inline-block h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    {meta.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm">
                            <Button
                                variant="secondary"
                                disabled={
                                    meta.current_page <= 1 || loading
                                }
                                onClick={() =>
                                    fetchPlaces(
                                        meta.current_page - 1
                                    )
                                }
                            >
                                <ChevronLeft className="mr-1 inline-block h-4 w-4" />
                                Previous
                            </Button>

                            <span className="text-sm text-slate-500">
                                Page <span className="font-medium text-slate-700">{meta.current_page}</span> of{' '}
                                <span className="font-medium text-slate-700">{meta.last_page}</span>
                            </span>

                            <Button
                                variant="secondary"
                                disabled={
                                    meta.current_page >=
                                        meta.last_page || loading
                                }
                                onClick={() =>
                                    fetchPlaces(
                                        meta.current_page + 1
                                    )
                                }
                            >
                                Next
                                <ChevronRight className="ml-1 inline-block h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
