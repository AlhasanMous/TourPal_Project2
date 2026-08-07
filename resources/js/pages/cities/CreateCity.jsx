import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cityService from '../../services/cityService';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function CreateCity() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name_ar: '',
        name_en: '',
        region: '',
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            await cityService.createCity(form);
            navigate('/cities');
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors ?? {};
                const mapped = {};
                Object.keys(serverErrors).forEach((key) => {
                    mapped[key] = serverErrors[key][0];
                });
                setErrors(mapped);
            } else {
                setGlobalError(err.response?.data?.message ?? 'Failed to create city.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader title="Add City" subtitle="Create a new city." />

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <ErrorMessage message={globalError} />

                <form onSubmit={handleSubmit}>
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

                    <Input
                        label="Region"
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                        error={errors.region}
                        required
                    />

                    <div className="flex gap-3">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                        <Link to="/cities">
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
