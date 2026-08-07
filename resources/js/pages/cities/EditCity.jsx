import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import cityService from '../../services/cityService';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function EditCity() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name_ar: '',
        name_en: '',
        region: '',
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCity = async () => {
            try {
                const data = await cityService.getCity(id);
                const city = data.city;
                setForm({
                    name_ar: city.name_ar,
                    name_en: city.name_en,
                    region: city.region,
                });
            } catch (err) {
                setGlobalError('Failed to load city.');
            } finally {
                setLoading(false);
            }
        };

        fetchCity();
    }, [id]);

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
            await cityService.updateCity(id, form);
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
                setGlobalError(err.response?.data?.message ?? 'Failed to update city.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader title="Edit City" subtitle="Update city details." />

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
                            {isSubmitting ? 'Saving...' : 'Update'}
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
