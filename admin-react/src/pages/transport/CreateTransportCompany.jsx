import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import transportService from '../../services/transportService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    ArrowLeft,
    Save,
    Languages,
    Phone,
    ToggleRight,
} from 'lucide-react';

// defined outside CreateTransportCompany — an inline definition would get a
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

export default function CreateTransportCompany() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name_ar: '',
        name_en: '',
        phone: '',
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await transportService.createCompany(form);

            navigate('/transport');
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to create transport company.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Add Transport Company"
                subtitle="Create a new transport company."
            />

            <ErrorMessage message={error} />

            <div className="w-full">
                <form onSubmit={handleSubmit} className="space-y-4">

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
                                placeholder="شركة القدموس للنقل"
                                required
                            />

                            <Input
                                label="English Name"
                                name="name_en"
                                value={form.name_en}
                                onChange={handleChange}
                                placeholder="Al-Qadmous Transport"
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
                            placeholder="+963-11-1234567"
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
                                disabled={loading}
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                {loading ? 'Creating...' : 'Create Company'}
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
