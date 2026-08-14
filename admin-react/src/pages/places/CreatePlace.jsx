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
    visit_duration_hours: 1,
    opening_hours: {},
    image: null,
    image_url: '',
});
const handleImageChange = (e) => {
    const file = e.target.files[0];

    setForm((prev) => ({
        ...prev,
        image: file,
        image_url: '',
    }));
};
const handleImageUrlChange = (e) => {
    setForm((prev) => ({
        ...prev,
        image_url: e.target.value,
        image: null,
    }));
};
const [errors, setErrors] = useState({});
const [globalError, setGlobalError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

// Load cities
useEffect(() => {
    const fetchCities = async () => {
        try {
            const data = await cityService.getAll();

            setCities(data ?? []);
        } catch (err) {
            setGlobalError(
                err.response?.data?.message ||
                    'Failed to load cities.'
            );
        } finally {
            setCitiesLoading(false);
        }
    };

    fetchCities();
}, []);

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

// Submit form
const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setGlobalError('');

    try {
       const formData = new FormData();

formData.append('name_ar', form.name_ar);
formData.append('name_en', form.name_en);
formData.append('description_ar', form.description_ar);
formData.append('description_en', form.description_en);
formData.append('city_id', Number(form.city_id));
formData.append('category', form.category);
formData.append(
    'visit_duration_hours',
    Number(form.visit_duration_hours)
);

if (form.image) {
    formData.append('image', form.image);
} else if (form.image_url?.trim()) {
    formData.append('image_url', form.image_url.trim());
}

await placeService.createPlace(formData);



        navigate('/places');
    // } catch (err) {
    //     if (err.response?.status === 422) {
    //         const serverErrors =
    //             err.response.data.errors ?? {};

    //         const mappedErrors = {};

    //         Object.entries(serverErrors).forEach(
    //             ([key, messages]) => {
    //                 mappedErrors[key] = Array.isArray(messages)
    //                     ? messages[0]
    //                     : messages;
    //             }
    //         );

    //         setErrors(mappedErrors);
    //     } else {
    //         setGlobalError(
    //             err.response?.data?.message ||
    //                 'Failed to create place. Please try again.'
    //         );
    //     }
    // }
    } catch (err) {

    console.log('CREATE PLACE ERROR:', err.response);

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
            err.message ||
            'Failed to create place.'
        );
    }
}
    finally {
        setIsSubmitting(false);
    }
};

// Loading cities
if (citiesLoading) {
    return <Loading message="Loading cities..." />;
}

return (
    <div>
        <PageHeader
            title="Add Place"
            subtitle="Create a new tourism place."
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





<div className="mb-4">
    <label className="mb-1 block text-sm font-medium text-gray-700">
        Place Image
    </label>

    <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full rounded border border-gray-300 px-3 py-2"
    />

    {form.image && (
        <p className="mt-2 text-sm text-gray-500">
            Selected: {form.image.name}
        </p>
    )}

    {errors.image && (
        <p className="mt-1 text-sm text-red-600">
            {errors.image}
        </p>
    )}
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
                            : 'Save Place'}
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
