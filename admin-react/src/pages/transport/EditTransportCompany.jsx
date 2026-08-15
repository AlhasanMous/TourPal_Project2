import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import transportService from '../../services/transportService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    ArrowLeft,
    Save,
    Languages,
    Phone,
    ToggleRight,
} from 'lucide-react';

// defined outside EditTransportCompany — an inline definition would get a
// fresh identity on every render (every keystroke) and cause the inputs
// to lose focus.
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

export default function EditTransportCompany() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name_ar: '',
        name_en: '',
        phone: '',
        is_active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCompany();
    }, [id]);

    const loadCompany = async () => {
        setLoading(true);
        setError('');

        try {
            const data =
                await transportService.getCompanies();

            const company = (data.companies ?? []).find(
                (item) => item.id === Number(id)
            );

            if (!company) {
                setError('Transport company not found.');
                return;
            }

            setForm({
                name_ar: company.name_ar ?? '',
                name_en: company.name_en ?? '',
                phone: company.phone ?? '',
                is_active: Boolean(company.is_active),
            });
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load company.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError('');

        try {
            await transportService.updateCompany(
                id,
                form
            );

            navigate('/transport');
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to update company.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader
                title="Edit Transport Company"
                subtitle="Update transport company information."
            />

            <ErrorMessage message={error} />

            <div className="w-full">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <FormSection
                        icon={Languages}
                        iconClass="text-teal-500"
                        title="Names"
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Arabic Name"
                                name="name_ar"
                                value={form.name_ar}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="English Name"
                                name="name_en"
                                value={form.name_en}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </FormSection>

                    <FormSection
                        icon={Phone}
                        iconClass="text-indigo-500"
                        title="Contact"
                    >
                        <Input
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </FormSection>

                    <FormSection
                        icon={ToggleRight}
                        iconClass="text-emerald-500"
                        title="Availability"
                    >
                        <label className="flex items-center gap-2.5 text-base font-medium text-slate-700">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                            />

                            Active
                        </label>
                    </FormSection>

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/transport')}
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={saving}
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                {saving ? 'Updating...' : 'Update Company'}
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
