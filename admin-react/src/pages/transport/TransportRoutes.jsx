import { useEffect, useState } from 'react';

import transportService from '../../services/transportService';

import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Bus,
    ArrowRight,
    Building2,
    Clock,
    Banknote,
} from 'lucide-react';

export default function TransportRoutes() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [transportType, setTransportType] = useState('');

    const fetchRoutes = async () => {
        setLoading(true);
        setError('');

        try {
            const data =
                await transportService.getRoutes();

            setRoutes(data.routes ?? []);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load transport routes.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleDelete = async (route) => {
        const origin =
            route.origin_city?.name_en ?? '';

        const destination =
            route.destination_city?.name_en ?? '';

        const confirmed = window.confirm(
            `Are you sure you want to delete "${origin} → ${destination}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await transportService.deleteRoute(
                route.id
            );

            fetchRoutes();
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to delete route.'
            );
        }
    };

    const filteredRoutes = routes.filter((route) => {
        const value = search.toLowerCase();

        const matchesSearch =
            route.origin_city?.name_ar
                ?.toLowerCase()
                .includes(value) ||
            route.origin_city?.name_en
                ?.toLowerCase()
                .includes(value) ||
            route.destination_city?.name_ar
                ?.toLowerCase()
                .includes(value) ||
            route.destination_city?.name_en
                ?.toLowerCase()
                .includes(value) ||
            route.company?.name_ar
                ?.toLowerCase()
                .includes(value) ||
            route.company?.name_en
                ?.toLowerCase()
                .includes(value);

        const matchesType =
            !transportType ||
            route.transport_type === transportType;

        return matchesSearch && matchesType;
    });

    const formatDuration = (minutes) => {
        if (!minutes) {
            return '-';
        }

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (mins === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${mins}m`;
    };

    const columns = [
        {
            key: 'route',
            label: 'Route',
            render: (route) => (
                <div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        {route.origin_city?.name_en}
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        {route.destination_city?.name_en}
                    </div>

                    <div className="text-xs text-slate-400">
                        {route.origin_city?.name_ar}
                        {' → '}
                        {route.destination_city?.name_ar}
                    </div>
                </div>
            ),
        },

        {
            key: 'company',
            label: 'Company',
            render: (route) => (
                <span className="flex items-center gap-1.5 text-slate-700">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {route.company?.name_en ?? '-'}
                </span>
            ),
        },

        {
            key: 'transport_type',
            label: 'Type',
            render: (route) => (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 ring-1 ring-inset ring-indigo-200">
                    <Bus className="h-3 w-3" />
                    {route.transport_type}
                </span>
            ),
        },

        {
            key: 'duration',
            label: 'Duration',
            render: (route) => (
                <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {formatDuration(
                        route.duration_minutes
                    )}
                </span>
            ),
        },

        {
            key: 'price',
            label: 'Price',
            render: (route) => (
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Banknote className="h-3.5 w-3.5 text-emerald-500" />
                    {route.price_approx ?? '-'}
                </span>
            ),
        },

        {
            key: 'status',
            label: 'Status',
            render: (route) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        route.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-rose-50 text-rose-700 ring-rose-200'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            route.is_active
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                        }`}
                    />

                    {route.is_active
                        ? 'Active'
                        : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="flex-1">
                        <Input
                            label="Search"
                            placeholder="Search city or company..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="lg:w-48">
                        <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <Bus className="h-3.5 w-3.5 text-slate-400" />
                            Transport Type
                        </label>

                        <select
                            value={transportType}
                            onChange={(e) =>
                                setTransportType(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                All types
                            </option>

                            <option value="bus">
                                Bus
                            </option>

                            <option value="train">
                                Train
                            </option>

                            <option value="taxi">
                                Taxi
                            </option>
                        </select>
                    </div>

                    <Link to="/transport/routes/create">
                        <Button>
                            <Plus className="mr-1.5 inline-block h-4 w-4" />
                            Add Route
                        </Button>
                    </Link>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                        <Search className="h-3 w-3" />
                        Showing {filteredRoutes.length} of {routes.length} routes
                    </span>
                </div>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredRoutes}
                        emptyMessage="No transport routes found."
                        actions={(route) => (
                            <div className="flex items-center justify-end gap-2">


                                <Link to={`/transport/routes/${route.id}/edit`}>
                                    <Button variant="secondary">
                                        <Pencil className="mr-1.5 h-4 w-4 text-indigo-600" />
                                        Edit
                                    </Button>
                                </Link>

                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleDelete(route)
                                    }
                                >
                                    <Trash2 className="mr-1.5 h-4 w-4" />
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
