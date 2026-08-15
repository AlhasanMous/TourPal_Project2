import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import cityService from '../../services/cityService';
import placeService from '../../services/placeService';

import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    Languages,
    MapPin,
    Tag,
    ImageIcon,
    FileText,
    Clock,
    Save,
    X,
    UploadCloud,
} from 'lucide-react';

const CATEGORIES = [
    { value: 'historical', label: 'Historical' },
    { value: 'nature', label: 'Nature' },
    { value: 'beach', label: 'Beach' },
    { value: 'adventure', label: 'Adventure' },
];

// defined outside EditPlace — an inline definition would get a fresh identity
// on every render (every keystroke) and cause the inputs to lose focus.
function FormSection({ icon: Icon, iconClass, title, children }) {
    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <p className="mb-4 flex items-center gap-2 text-base font-bold text-slate-700">
                {Icon && <Icon className={`h-5 w-5 ${iconClass ?? ''}`} />}
                {title}
            </p>

            {children}
        </div>
    );
}

export default function EditPlace() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);

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
                console.log('PLACE DATA:', place);
                setCities(citiesData ?? []);
                if (place.images && place.images.length > 0) {

                    const mainImage = place.images.find(
                        (img) => img.is_main
                    ) || place.images[0];

                    setCurrentImage(mainImage.url);
                }
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
                    image: null,
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
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setForm((prev) => ({
            ...prev,
            image: file,
        }));
    };
    // Submit update
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
            }


            await placeService.updatePlace(id, formData);
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

            <ErrorMessage message={globalError} />

            <div className="w-full" dir="ltr">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">

                    <FormSection
                        icon={Languages}
                        iconClass="text-teal-500"
                        title="Names & Image"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Left column — Arabic name stacked over English name */}
                            <div className="flex flex-col gap-5">
                                <div className="w-full text-left">
                                    <Input
                                        label="Name (Arabic)"
                                        name="name_ar"
                                        value={form.name_ar}
                                        onChange={handleChange}
                                        error={errors.name_ar}
                                        dir="ltr"
                                        required
                                    />
                                </div>

                                <div className="w-full text-left">
                                    <Input
                                        label="Name (English)"
                                        name="name_en"
                                        value={form.name_en}
                                        onChange={handleChange}
                                        error={errors.name_en}
                                        dir="ltr"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right column — image */}
                            <div>
                                <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-600">
                                    <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                                    Current Image
                                </label>

                                {currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt="Current Place"
                                        className="mb-4 h-40 w-40 rounded-xl border border-slate-200 object-cover"
                                        onError={(e) => {
                                            e.target.src = '/images/no-image.png';
                                        }}
                                    />
                                ) : (
                                    <p className="mb-4 text-sm text-slate-500">
                                        No image available
                                    </p>
                                )}

                                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-600">
                                    <UploadCloud className="h-3.5 w-3.5 text-slate-400" />
                                    Change Place Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                                />

                                {form.image && (
                                    <div className="mt-3">

                                        <p className="text-sm text-slate-500">
                                            New image: {form.image.name}
                                        </p>

                                        <img
                                            src={URL.createObjectURL(form.image)}
                                            alt="New Preview"
                                            className="mt-2 h-40 w-40 rounded-xl border border-slate-200 object-cover"
                                        />

                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>

                    <FormSection
                        icon={MapPin}
                        iconClass="text-orange-500"
                        title="Location & Category"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* City */}
                            <div>
                                <label
                                    htmlFor="city_id"
                                    className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-600"
                                >
                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                    City
                                </label>

                                <select
                                    id="city_id"
                                    name="city_id"
                                    value={form.city_id}
                                    onChange={handleChange}
                                    required
                                    className={`w-full rounded-lg border px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.city_id
                                            ? 'border-red-500'
                                            : 'border-slate-300'
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
                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-600"
                                >
                                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                                    Category
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    className={`w-full rounded-lg border px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.category
                                            ? 'border-red-500'
                                            : 'border-slate-300'
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
                    </FormSection>

                    <FormSection
                        icon={FileText}
                        iconClass="text-blue-500"
                        title="Descriptions"
                    >
                        {/* Arabic Description */}
                        <div className="mb-5">
                            <label
                                htmlFor="description_ar"
                                className="mb-1.5 block text-sm font-bold text-slate-600"
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
                                dir="ltr"
                                className={`w-full rounded-lg border px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.description_ar
                                        ? 'border-red-500'
                                        : 'border-slate-300'
                                }`}
                            />

                            {errors.description_ar && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description_ar}
                                </p>
                            )}
                        </div>

                        {/* English Description */}
                        <div>
                            <label
                                htmlFor="description_en"
                                className="mb-1.5 block text-sm font-bold text-slate-600"
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
                                dir="ltr"
                                className={`w-full rounded-lg border px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.description_en
                                        ? 'border-red-500'
                                        : 'border-slate-300'
                                }`}
                            />

                            {errors.description_en && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description_en}
                                </p>
                            )}
                        </div>
                    </FormSection>

                    <FormSection
                        icon={Clock}
                        iconClass="text-teal-500"
                        title="Visit Duration"
                    >
                        <div className="max-w-md text-left">
                            <Input
                                label="Visit Duration (hours)"
                                type="number"
                                name="visit_duration_hours"
                                value={form.visit_duration_hours}
                                onChange={handleChange}
                                error={errors.visit_duration_hours}
                                dir="ltr"
                                min={1}
                                step={1}
                                required
                            />
                        </div>
                    </FormSection>

                    {/* Actions */}
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <Save className="mr-1.5 inline-block h-4 w-4" />
                                {isSubmitting
                                    ? 'Saving...'
                                    : 'Update Place'}
                            </Button>

                            <Link to="/places">
                                <Button
                                    variant="secondary"
                                    type="button"
                                >
                                    <X className="mr-1.5 inline-block h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
