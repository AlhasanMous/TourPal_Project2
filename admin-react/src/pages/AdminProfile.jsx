import { useEffect, useMemo, useState } from 'react';
import {
    UserCircle2,
    Mail,
    FileText,
    Languages as LanguagesIcon,
    ShieldCheck,
    Save,
    CheckCircle2,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import PageHeader from '../components/layout/PageHeader';

function FormSection({ icon: Icon, title, children, accentClass = 'text-indigo-500' }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-700">
                <Icon className={`h-5 w-5 ${accentClass}`} />
                <span>{title}</span>
            </div>
            {children}
        </div>
    );
}

export default function AdminProfile() {
    const { user, refreshUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        name: '',
        bio: '',
        languages: '',
        is_matching_enabled: false,
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setForm({
            name: user.name ?? '',
            bio: user.bio ?? '',
            languages: Array.isArray(user.languages) ? user.languages.join(', ') : '',
            is_matching_enabled: Boolean(user.is_matching_enabled),
        });
        setLoading(false);
    }, [user]);

    const initials = useMemo(() => {
        if (!form.name) {
            return 'A';
        }

        return form.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, [form.name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleToggle = () => {
        setForm((prev) => ({ ...prev, is_matching_enabled: !prev.is_matching_enabled }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError('Name is required.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const payload = {
                name: form.name.trim(),
                bio: form.bio?.trim() || null,
                languages: form.languages
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                is_matching_enabled: form.is_matching_enabled,
            };

            await authService.updateProfile(payload);
            await refreshUser();
            setSuccess('Profile updated successfully.');
        } catch (err) {
            const message = err.response?.data?.message ?? 'Failed to update profile.';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading message="Loading profile..." />;
    }

    return (
        <div className="w-full">
            <PageHeader
                title="Admin Profile"
                subtitle="Manage your account details and basic profile settings."
            />

            <ErrorMessage message={error} />

            {success && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white shadow-sm">
                                {initials}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{user?.name ?? 'Admin'}</h2>
                                <p className="text-sm text-slate-500">{user?.email ?? 'admin@tourpal.sy'}</p>
                            </div>
                        </div>

                        <Button type="submit" disabled={saving} className="px-5 py-2.5">
                            <Save className="mr-1.5 inline-block h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <FormSection icon={UserCircle2} title="Basic Information" accentClass="text-violet-500">
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />

                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                    Email Address
                                </label>
                                <p className="text-base text-slate-700">{user?.email ?? 'No email available'}</p>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection icon={ShieldCheck} title="Account Settings" accentClass="text-emerald-500">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Matching enabled</p>
                                    <p className="text-xs text-slate-500">Allow profile matching and recommendations.</p>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Toggle matching"
                                    onClick={handleToggle}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                                        form.is_matching_enabled ? 'bg-indigo-600' : 'bg-slate-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 rounded-full bg-white transition ${
                                            form.is_matching_enabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </FormSection>
                </div>

                <FormSection icon={FileText} title="About You" accentClass="text-sky-500">
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write a short bio about yourself..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </FormSection>

                <FormSection icon={LanguagesIcon} title="Languages" accentClass="text-amber-500">
                    <Input
                        label="Languages"
                        name="languages"
                        type="text"
                        value={form.languages}
                        onChange={handleChange}
                        placeholder="Arabic, English, French"
                    />
                    <p className="-mt-2 text-xs text-slate-500">Separate multiple languages with commas.</p>
                </FormSection>
            </form>
        </div>
    );
}
