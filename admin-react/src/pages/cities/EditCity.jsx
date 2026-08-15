import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import cityService from '../../services/cityService';

import { Save, X, Building2, Languages, MapPin } from 'lucide-react';

// defined outside EditCity — an inline definition would get a fresh identity
// on every render (every keystroke) and cause the inputs to lose focus.
function FormSection({ icon: Icon, iconClass, title, children }) {
    return (
        <div className="rounded-xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <p className="mb-4 flex items-center gap-2 text-base font-bold text-slate-700">
                {Icon && <Icon className={`h-5 w-5 ${iconClass ?? ''}`} />}
                {title}
            </p>

            {children}
        </div>
    );
}

export default function EditCity() {
    const { id } = useParams();
    const navigate = useNavigate();


    const [form, setForm] = useState({
        name_ar: '',
        name_en: '',
        region: '',
    });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    useEffect(() => {
        const fetchCity = async () => {
            try {
                setLoading(true);
                setGlobalError('');

                const city = await cityService.getById(id);

                setForm({
                    name_ar: city.name_ar ?? '',
                    name_en: city.name_en ?? '',
                    region: city.region ?? '',
                });
            } catch (err) {
                setGlobalError(
                    err.response?.data?.message ||
                    'Failed to load the city. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCity();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));

        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        setErrors({});
        setGlobalError('');

        try {
            await cityService.update(id, form);

            navigate('/cities');
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors ?? {};
                const mappedErrors = {};

                Object.keys(serverErrors).forEach((key) => {
                    mappedErrors[key] = Array.isArray(serverErrors[key])
                        ? serverErrors[key][0]
                        : serverErrors[key];
                });

                setErrors(mappedErrors);
            } else {
                setGlobalError(
                    err.response?.data?.message ||
                    'Failed to update the city. Please try again.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loading message="Loading city..." />;
    }

    return (
        <div>
            <PageHeader
                title="Edit City"
                subtitle="Update the city information."
            />

            <ErrorMessage message={globalError} />

            <div className="w-full" dir="ltr">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">

                    {/* Identity card — icon + city name preview, mirrors the guide hero card */}
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white p-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                            <Building2 className="h-7 w-7" />
                        </div>

                        <div className="text-left">
                            <p className="text-lg font-bold text-slate-900">
                                {form.name_en || form.name_ar || 'New City'}
                            </p>
                            <p className="text-sm text-slate-500">
                                Editing city details
                            </p>
                        </div>
                    </div>

                    <FormSection
                        icon={Languages}
                        iconClass="text-teal-500"
                        title="Names"
                    >
                        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="w-full text-left">
                                <Input
                                    label="Arabic Name"
                                    type="text"
                                    name="name_ar"
                                    value={form.name_ar}
                                    onChange={handleChange}
                                    placeholder="مثال: دمشق"
                                    error={errors.name_ar}
                                    dir="ltr"
                                    required
                                />
                            </div>

                            <div className="w-full text-left">
                                <Input
                                    label="English Name"
                                    type="text"
                                    name="name_en"
                                    value={form.name_en}
                                    onChange={handleChange}
                                    placeholder="Example: Damascus"
                                    error={errors.name_en}
                                    dir="ltr"
                                    required
                                />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection
                        icon={MapPin}
                        iconClass="text-orange-500"
                        title="Location"
                    >
                        <div className="w-full text-left">
                            <Input
                                label="Region"
                                type="text"
                                name="region"
                                value={form.region}
                                onChange={handleChange}
                                placeholder="Example: Damascus Governorate"
                                error={errors.region}
                                dir="ltr"
                                required
                            />
                        </div>
                    </FormSection>

                    <div className="rounded-xl border border-slate-200/70 bg-white p-6">
                        <p className="mb-4 flex items-center gap-2 text-base font-bold text-slate-700">
                            <Save className="h-5 w-5 text-slate-400" />
                            Save Actions
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/cities')}
                                disabled={isSubmitting}
                            >
                                <X className="mr-1.5 inline-block h-4 w-4" />
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <Save className="mr-1.5 inline-block h-4 w-4" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
