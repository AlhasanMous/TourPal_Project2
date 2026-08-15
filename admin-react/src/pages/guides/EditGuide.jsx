import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import guideService from '../../services/guideService';
import cityService from '../../services/cityService';

import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function EditGuide() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cities, setCities] = useState([]);
    const [cityId, setCityId] = useState('');

    const [specializations, setSpecializations] = useState('');
    const [availability, setAvailability] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const [guideData, cityList] = await Promise.all([
                    guideService.getGuide(id),
                    cityService.getAll(),
                ]);

                const g = guideData.guide ?? guideData;
                setGuide(g);
                setCities(Array.isArray(cityList) ? cityList : []);
                setCityId(g.city_id ?? g.city?.id ?? '');
                setSpecializations(Array.isArray(g.specializations) ? g.specializations.join(', ') : (g.specializations || ''));
                setAvailability(Array.isArray(g.availability) ? JSON.stringify(g.availability, null, 2) : (g.availability ? JSON.stringify(g.availability, null, 2) : JSON.stringify([], null, 2)));
            } catch (err) {
                setError(err.response?.data?.message ?? 'Failed to load guide.');
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Backend currently has no update endpoint for admin guides.
        // Inform user and do not attempt to call a non-existent endpoint.
        alert('Update endpoint not available on backend. Please add PATCH/PUT /api/admin/guides/{id} to enable saving edits.');
    };

    if (loading) return <Loading />;

    return (
        <div>
            <PageHeader title={`Edit Guide: ${guide?.user?.name ?? id}`} subtitle="View or prepare edits (save disabled)." />

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <Input value={guide?.user?.name ?? ''} disabled />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                    <Input value={guide?.user?.email ?? ''} disabled />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                    <select
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name_en || city.name_ar || 'City'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Specializations (comma separated)</label>
                    <Input value={specializations} onChange={(e) => setSpecializations(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Availability (JSON)</label>
                    <textarea value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full rounded border border-gray-300 p-2" />
                </div>

                <div className="flex gap-2">
                    <Button type="submit">Save (disabled)</Button>
                    <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
            </form>
        </div>
    );
}
