import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cityService from '../../services/cityService';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/tables/DataTable';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

export default function CitiesList() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    const fetchCities = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await cityService.getAdminCities();
            setCities(data.cities ?? []);
        } catch (err) {
            setError('Failed to load cities.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleDelete = async () => {
        try {
            await cityService.deleteCity(deleting.id);
            setCities((prev) => prev.filter((city) => city.id !== deleting.id));
        } catch (err) {
            setError('Failed to delete city.');
        } finally {
            setDeleting(null);
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name_ar', label: 'Name (AR)' },
        { key: 'name_en', label: 'Name (EN)' },
        { key: 'region', label: 'Region' },
    ];

    return (
        <div>
            <PageHeader
                title="Cities"
                subtitle="Manage cities available on the platform."
                actionLabel="Add City"
                actionTo="/cities/create"
            />

            <ErrorMessage message={error} onRetry={fetchCities} />

            {loading ? (
                <Loading />
            ) : (
                <DataTable
                    columns={columns}
                    data={cities}
                    emptyMessage="No cities found."
                    actions={(row) => (
                        <div className="flex justify-end gap-2">
                            <Link to={`/cities/${row.id}/edit`}>
                                <Button variant="secondary">Edit</Button>
                            </Link>
                            <Button
                                variant="danger"
                                onClick={() => setDeleting(row)}
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                />
            )}

            <Modal
                isOpen={!!deleting}
                title="Delete City"
                message={`Are you sure you want to delete "${deleting?.name_en}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
                confirmText="Delete"
            />
        </div>
    );
}
