import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import placeService from '../../services/placeService';

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

const columns = [
    {
        key: 'main_image',
        label: 'Image',
        render: (place) =>
            place.main_image ? (
                <img
                    src={place.main_image}
                    alt={place.name_en}
                    className="h-12 w-16 rounded object-cover"
                />
            ) : (
                <div className="flex h-12 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                    No Image
                </div>
            ),
    },
    {
        key: 'name_en',
        label: 'Name',
        render: (place) => (
            <div>
                <div className="font-medium text-gray-900">
                    {place.name_en}
                </div>

                <div className="text-sm text-gray-500">
                    {place.name_ar}
                </div>
            </div>
        ),
    },
    {
        key: 'city',
        label: 'City',
        render: (place) =>
            place.city?.name_en ||
            place.city?.name_ar ||
            '-',
    },
    {
        key: 'category',
        label: 'Category',
    },
    {
        key: 'avg_rating',
        label: 'Rating',
        render: (place) => place.avg_rating ?? '0.00',
    },
    {
        key: 'visit_duration_hours',
        label: 'Duration',
        render: (place) =>
            `${place.visit_duration_hours ?? 0} h`,
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

        <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label
                        htmlFor="place-search"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Search
                    </label>

                    <input
                        id="place-search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, city, or category..."
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="place-category"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Category
                    </label>

                    <input
                        id="place-category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Filter by category..."
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="place-sort"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Sort
                    </label>

                    <select
                        id="place-sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>
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
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>

        {loading ? (
            <Loading message="Loading places..." />
        ) : (
            <>
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
                                    Edit
                                </Button>
                            </Link>

                            <Button
                                variant="danger"
                                onClick={() =>
                                    handleDelete(place)
                                }
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                />

                {meta.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
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
                            Previous
                        </Button>

                        <span className="text-sm text-gray-600">
                            Page {meta.current_page} of{' '}
                            {meta.last_page}
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
                        </Button>
                    </div>
                )}
            </>
        )}
    </div>
);


}
