import Loading from '../../components/common/Loading';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import transportService from '../../services/transportService';
import cityService from '../../services/cityService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    ArrowLeft,
    Save,
    Building2,
    MapPin,
    Clock,
    Bus,
    FileText,
    ToggleRight,
} from 'lucide-react';

// defined outside CreateTransportRoute — an inline definition would get a
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

export default function CreateTransportRoute() {
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);
    const [cities, setCities] = useState([]);

    const [form, setForm] = useState({
        company_id: '',
        origin_city_id: '',
        destination_city_id: '',
        duration_minutes: '',
        price_approx: '',
        transport_type: 'bus',
        schedule_notes: '',
        is_active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError('');

        try {
           const [companiesData, citiesData] =
    await Promise.all([
        transportService.getCompanies(),
        cityService.getAll(),
    ]);

setCompanies(
    companiesData.companies ?? []
);

setCities(
    citiesData ?? []
);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load form data.'
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
            await transportService.createRoute({
                ...form,
                company_id: Number(form.company_id),
                origin_city_id: Number(form.origin_city_id),
                destination_city_id: Number(
                    form.destination_city_id
                ),
                duration_minutes: Number(
                    form.duration_minutes
                ),
                price_approx: Number(
                    form.price_approx
                ),
            });

            navigate('/transport');
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to create route.'
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
                title="Add Transport Route"
                subtitle="Create a new transport route."
            />

            <ErrorMessage message={error} />

            <div className="w-full">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <FormSection
                        icon={Building2}
                        iconClass="text-indigo-500"
                        title="Company"
                    >
                        <select
                            name="company_id"
                            value={form.company_id}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">
                                Select company
                            </option>

                            {companies.map((company) => (
                                <option
                                    key={company.id}
                                    value={company.id}
                                >
                                    {company.name_en}
                                </option>
                            ))}
                        </select>
                    </FormSection>

                    <FormSection
                        icon={MapPin}
                        iconClass="text-orange-500"
                        title="Route Cities"
                    >
                        <div className="grid gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-slate-600">
                                    Origin City
                                </label>

                                <select
                                    name="origin_city_id"
                                    value={form.origin_city_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select origin
                                    </option>

                                    {cities.map((city) => (
                                        <option
                                            key={city.id}
                                            value={city.id}
                                        >
                                            {city.name_en}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-slate-600">
                                    Destination City
                                </label>

                                <select
                                    name="destination_city_id"
                                    value={form.destination_city_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        Select destination
                                    </option>

                                    {cities.map((city) => (
                                        <option
                                            key={city.id}
                                            value={city.id}
                                        >
                                            {city.name_en}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </FormSection>

                    <FormSection
                        icon={Clock}
                        iconClass="text-teal-500"
                        title="Duration & Price"
                    >
                        <div className="grid gap-5 md:grid-cols-2">

                            <Input
                                label="Duration (minutes)"
                                name="duration_minutes"
                                type="number"
                                value={form.duration_minutes}
                                onChange={handleChange}
                                placeholder="180"
                                required
                            />

                            <Input
                                label="Approximate Price"
                                name="price_approx"
                                type="number"
                                value={form.price_approx}
                                onChange={handleChange}
                                placeholder="15000"
                                required
                            />

                        </div>
                    </FormSection>

                    <FormSection
                        icon={Bus}
                        iconClass="text-violet-500"
                        title="Transport Type"
                    >
                        <select
                            name="transport_type"
                            value={form.transport_type}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="bus">
                                Bus
                            </option>

                            <option value="train">
                                Train
                            </option>

                            <option value="taxi">
                                Taxi
                            </option>
                        </select>
                    </FormSection>

                    <FormSection
                        icon={FileText}
                        iconClass="text-blue-500"
                        title="Schedule Notes"
                    >
                        <textarea
                            name="schedule_notes"
                            value={form.schedule_notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="06:00, 10:00, 14:00, 18:00"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                                onClick={() =>
                                    navigate('/transport')
                                }
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={saving}
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                {saving
                                    ? 'Creating...'
                                    : 'Create Route'}
                            </Button>

                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
