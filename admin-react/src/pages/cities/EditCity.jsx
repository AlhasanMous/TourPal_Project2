import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import cityService from '../../services/cityService';

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

        <div className="max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
            <ErrorMessage message={globalError} />

            <form onSubmit={handleSubmit}>
                <Input
                    label="Arabic Name"
                    type="text"
                    name="name_ar"
                    value={form.name_ar}
                    onChange={handleChange}
                    placeholder="مثال: دمشق"
                    error={errors.name_ar}
                    required
                />

                <Input
                    label="English Name"
                    type="text"
                    name="name_en"
                    value={form.name_en}
                    onChange={handleChange}
                    placeholder="Example: Damascus"
                    error={errors.name_en}
                    required
                />

                <Input
                    label="Region"
                    type="text"
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    placeholder="Example: Damascus Governorate"
                    error={errors.region}
                    required
                />

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/cities')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    </div>
);


}
