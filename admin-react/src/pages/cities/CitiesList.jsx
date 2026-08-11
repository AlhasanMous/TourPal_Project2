import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import cityService from '../../services/cityService';

export default function CitiesList() {
const [cities, setCities] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [search, setSearch] = useState('');


const fetchCities = async () => {
    try {
        setLoading(true);
        setError('');

        const data = await cityService.getAll();
        setCities(data);
    } catch (err) {
        setError(
            err.response?.data?.message ||
            'Failed to load cities. Please try again.'
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchCities();
}, []);

const filteredCities = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
        return cities;
    }

    return cities.filter((city) =>
        [
            city.name_ar,
            city.name_en,
            city.region,
            String(city.id),
        ].some((value) =>
            String(value ?? '').toLowerCase().includes(searchTerm)
        )
    );
}, [cities, search]);

const handleDelete = async (city) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${city.name_en}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        setError('');

        await cityService.remove(city.id);

        setCities((currentCities) =>
            currentCities.filter((item) => item.id !== city.id)
        );
    } catch (err) {
        setError(
            err.response?.data?.message ||
            'Failed to delete the city. Please try again.'
        );
    }
};

const columns = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'name_ar',
        label: 'Arabic Name',
    },
    {
        key: 'name_en',
        label: 'English Name',
    },
    {
        key: 'region',
        label: 'Region',
    },
];

return (
    <div>
        <PageHeader
            title="Cities"
            subtitle="Manage cities available in TourPal."
            actionLabel="Add City"
            actionTo="/cities/create"
        />

        <ErrorMessage message={error} />

        {!loading && (
            <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <label
                            htmlFor="city-search"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Search Cities
                        </label>

                        <input
                            id="city-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by ID, Arabic name, English name, or region..."
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="text-sm text-gray-500 sm:pt-6">
                        Showing {filteredCities.length} of {cities.length} cities
                    </div>
                </div>
            </div>
        )}

        {loading ? (
            <Loading message="Loading cities..." />
        ) : (
            <DataTable
                columns={columns}
                data={filteredCities}
                emptyMessage={
                    search.trim()
                        ? 'No cities match your search.'
                        : 'No cities found.'
                }
                actions={(city) => (
                    <div className="flex justify-end gap-2">
                        <Link to={`/cities/${city.id}/edit`}>
                            <Button variant="secondary">
                                Edit
                            </Button>
                        </Link>

                        <Button
                            variant="danger"
                            onClick={() => handleDelete(city)}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            />
        )}
    </div>
);


}
