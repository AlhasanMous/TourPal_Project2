import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import cityService from '../../services/cityService';

import {
    Search as SearchIcon,
    MapPin,
    Pencil,
    Trash2,
    Building2,
} from 'lucide-react';

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
            render: (city) => (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    #{city.id}
                </span>
            ),
        },
        {
            key: 'name_ar',
            label: 'Arabic Name',
            render: (city) => (
                <span className="font-medium text-slate-900" dir="rtl">
                    {city.name_ar || '-'}
                </span>
            ),
        },
        {
            key: 'name_en',
            label: 'English Name',
            render: (city) => (
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {city.name_en || '-'}
                </span>
            ),
        },
        {
            key: 'region',
            label: 'Region',
            render: (city) => (
                <span className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {city.region || '-'}
                </span>
            ),
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
                <div className="mb-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                            <label
                                htmlFor="city-search"
                                className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600"
                            >
                                <SearchIcon className="h-3.5 w-3.5 text-slate-400" />
                                Search Cities
                            </label>

                            <input
                                id="city-search"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by ID, Arabic name, English name, or region..."
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 sm:mt-6">
                            Showing {filteredCities.length} of {cities.length} cities
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <Loading message="Loading cities..." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
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
                                        <Pencil className="mr-1.5 inline-block h-4 w-4 text-indigo-600" />
                                        Edit
                                    </Button>
                                </Link>

                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(city)}
                                >
                                    <Trash2 className="mr-1.5 inline-block h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
