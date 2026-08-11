import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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

export default function EditPlace() {
const { id } = useParams();
const navigate = useNavigate();

const [cities, setCities] = useState([]);
const [loading, setLoading] = useState(true);

const [form, setForm] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    city_id: '',
    category: '',
    visit_duration_hours: 1,
    opening_hours: {},
});

const [errors, setErrors] = useState({});
const [globalError, setGlobalError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

// Load place + cities
useEffect(() => {
    const fetchData = async () => {
        try {
            const [placeData, citiesData] = await Promise.all([
                placeService.getPlace(id),
                cityService.getAll(),
            ]);

            const place = placeData.place;

            setCities(citiesData ?? []);

            setForm({
                name_ar: place.name_ar ?? '',
                name_en: place.name_en ?? '',
                description_ar: place.description_ar ?? '',
                description_en: place.description_en ?? '',
                city_id: place.city?.id ?? place.city_id ?? '',
                category: place.category ?? '',
                visit_duration_hours:
                    place.visit_duration_hours ?? 1,
                opening_hours: place.opening_hours ?? {},
            });
        } catch (err) {
            setGlobalError(
                err.response?.data?.message ||
                    'Failed to load place data.'
            );
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [id]);

// Handle inputs
const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]:
            name === 'visit_duration_hours'
                ? Number(value)
                : value,
    }));

    setErrors((prev) => ({
        ...prev,
        [name]: '',
    }));

    setGlobalError('');
};

// Submit update
const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setGlobalError('');

    try {
        const payload = {
            ...form,
            city_id: Number(form.city_id),
            visit_duration_hours: Number(
                form.visit_duration_hours
            ),
        };

        await placeService.updatePlace(id, payload);

        navigate('/places');
    } catch (err) {
        if (err.response?.status === 422) {
            const serverErrors =
                err.response.data.errors ?? {};

            const mappedErrors = {};

            Object.entries(serverErrors).forEach(
                ([key, messages]) => {
                    mappedErrors[key] = Array.isArray(messages)
                        ? messages[0]
                        : messages;
                }
            );

            setErrors(mappedErrors);
        } else {
            setGlobalError(
                err.response?.data?.message ||
                    'Failed to update place. Please try again.'
            );
        }
    } finally {
        setIsSubmitting(false);
    }
};

if (loading) {
    return <Loading message="Loading place..." />;
}

return (
    <div>
        <PageHeader
            title="Edit Place"
            subtitle="Update tourism place details."
        />

        <div className="rounded-lg bg-white p-6 shadow-sm">
            <ErrorMessage message={globalError} />

            <form onSubmit={handleSubmit}>
                {/* Names */}
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

                {/* City + Category */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* City */}
                    <div className="mb-4">
                        <label
                            htmlFor="city_id"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            City
                        </label>

                        <select
                            id="city_id"
                            name="city_id"
                            value={form.city_id}
                            onChange={handleChange}
                            required
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.city_id
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                        >
                            <option value="">
                                Select city
                            </option>

                            {cities.map((city) => (
                                <option
                                    key={city.id}
                                    value={city.id}
                                >
                                    {city.name_en} - {city.name_ar}
                                </option>
                            ))}
                        </select>

                        {errors.city_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.city_id}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <label
                            htmlFor="category"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.category
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                        >
                            <option value="">
                                Select category
                            </option>

                            {CATEGORIES.map((category) => (
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </option>
                            ))}
                        </select>

                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.category}
                            </p>
                        )}
                    </div>
                </div>

                {/* Arabic Description */}
                <div className="mb-4">
                    <label
                        htmlFor="description_ar"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Description (Arabic)
                    </label>

                    <textarea
                        id="description_ar"
                        name="description_ar"
                        value={form.description_ar}
                        onChange={handleChange}
                        rows={4}
                        required
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.description_ar
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                    />

                    {errors.description_ar && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description_ar}
                        </p>
                    )}
                </div>

                {/* English Description */}
                <div className="mb-4">
                    <label
                        htmlFor="description_en"
                        className="mb-1 block text-sm font-medium text-gray-700"
                    >
                        Description (English)
                    </label>

                    <textarea
                        id="description_en"
                        name="description_en"
                        value={form.description_en}
                        onChange={handleChange}
                        rows={4}
                        required
                        className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.description_en
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                    />

                    {errors.description_en && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.description_en}
                        </p>
                    )}
                </div>

                {/* Visit Duration */}
                <div className="max-w-md">
                    <Input
                        label="Visit Duration (hours)"
                        type="number"
                        name="visit_duration_hours"
                        value={form.visit_duration_hours}
                        onChange={handleChange}
                        error={errors.visit_duration_hours}
                        min={1}
                        step={1}
                        required
                    />
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : 'Update Place'}
                    </Button>

                    <Link to="/places">
                        <Button
                            variant="secondary"
                            type="button"
                        >
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    </div>
);


}
