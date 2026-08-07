import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cityService from '../../services/cityService';
import placeService from '../../services/placeService';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const CATEGORIES = [
    { value: 'historical', label: 'Historical' },
    { value: 'nature', label: 'Nature' },
    { value: 'beach', label: 'Beach' },
    { value: 'adventure', label: 'Adventure' },
];

export default function CreatePlace() {
    const navigate = useNavigate();

    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [form, setForm] = useState({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        city_id: '',
        category: '',
        visit_duration_hours: '',
        opening_hours: {},
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await cityService.getCities();
                setCities(data.cities ?? []);
            } catch {
                setGlobalError('Failed to load cities.');
            } finally {
                setCitiesLoading(false);
            }
        };

        fetchCities();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setGlobalError('');

        try {
            await placeService.createPlace(form);
            navigate('/places');
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors ?? {};
                const mapped = {};
                Object.keys(serverErrors).forEach((key) => {
                    mapped[key] = serverErrors[key][0];
                });
                setErrors(mapped);
            } else {
                setGlobalError(err.response?.data?.message ?? 'Failed to create place.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (citiesLoading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader title="Add Place" subtitle="Create a new tourism place." />

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <ErrorMessage message={globalError} />

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
                            label="Name (Arabic)"
                            name="name_ar"
                            value={form.name_ar}
                            onChange={handleChange}
                            error={errors.name_ar}
                            required
                        />

                        <Input
                            label="Name (English)"
                            name="name_en"
                            value={form.name_en}
                            onChange={handleChange}
                            error={errors.name_en}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <select
                                name="city_id"
                                value={form.city_id}
                                onChange={handleChange}
                                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.city_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">Select city</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name_en}
                                    </option>
                                ))}
                            </select>
                            {errors.city_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.category ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description (Arabic)
                        </label>
                        <textarea
                            name="description_ar"
                            value={form.description_ar}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.description_ar ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.description_ar && (
                            <p className="mt-1 text-sm text-red-600">{errors.description_ar}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description (English)
                        </label>
                        <textarea
                            name="description_en"
                            value={form.description_en}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.description_en ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {errors.description_en && (
                            <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>
                        )}
                    </div>

                    <Input
                        label="Visit Duration (hours)"
                        type="number"
                        name="visit_duration_hours"
                        value={form.visit_duration_hours}
                        onChange={handleChange}
                        error={errors.visit_duration_hours}
                        min={1}
                        required
                    />

                    <div className="flex gap-3">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Link to="/places">
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
