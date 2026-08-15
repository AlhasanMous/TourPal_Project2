import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import userService from '../../services/userService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

import {
    ArrowLeft,
    Pencil,
    ShieldCheck,
    Mail,
    BadgeCheck,
    Radar,
    Home,
    CalendarPlus,
    CalendarClock,
    Trash2,
    FileText,
    Languages,
    CircleDot,
    UserRound,
} from 'lucide-react';

export default function ViewUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await userService.getUser(id);

                setUser(data.user);
            } catch (err) {
                setError(
                    err.response?.data?.message ??
                    'Failed to load user.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <div>
                <PageHeader
                    title="User Details"
                    subtitle="View user account information."
                />

                <ErrorMessage
                    message={error || 'User not found.'}
                />

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/users')}
                >
                    <ArrowLeft className="mr-1.5 inline-block h-4 w-4" />
                    Back to Users
                </Button>
            </div>
        );
    }

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString();
    };

    // purely visual — icon + label + value tile, matches the guide-page stat cards
    const StatCard = ({ icon: Icon, iconClass, label, children, span }) => (
        <div
            className={`rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm ${
                span ? 'md:col-span-2' : ''
            }`}
        >
            <p className="flex items-center gap-2 text-sm font-bold text-slate-600">
                {Icon && <Icon className={`h-4 w-4 ${iconClass ?? ''}`} />}
                {label}
            </p>

            <div className="mt-2 text-lg font-semibold text-slate-900">
                {children}
            </div>
        </div>
    );

    return (
        <div>
            <PageHeader
                title="User Details"
                subtitle="View user account information."
            />

            <ErrorMessage message={error} />

            <div className="w-full space-y-4">

                {/* Identity hero card — tinted by account status, like the guide verification card */}
                <div
                    className={`flex flex-col gap-3 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between ${
                        user.is_deleted
                            ? 'border-rose-200 bg-rose-50/60'
                            : 'border-slate-200/70 bg-white'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        {user.profile_photo ? (
                            <img
                                src={user.profile_photo}
                                alt={user.name}
                                className="h-16 w-16 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-violet-100 text-2xl font-bold text-violet-700">
                                {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                        )}

                        <div>
                            <p className="text-xl font-bold text-slate-900">
                                {user.name || '-'}
                            </p>
                            <p className="flex items-center gap-1.5 text-base text-slate-500">
                                <Mail className="h-4 w-4" />
                                {user.email || '-'}
                            </p>
                        </div>
                    </div>

                    <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                            user.is_deleted
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-700'
                        }`}
                    >
                        <CircleDot className="h-3.5 w-3.5" />
                        {user.is_deleted ? 'deleted' : 'active'}
                    </span>
                </div>

                {/* Stat card grid — mirrors City / Bookings / Reviews / Specializations layout, now full width */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <StatCard
                        icon={ShieldCheck}
                        iconClass="text-violet-500"
                        label="Role"
                    >
                        {user.roles && user.roles.length > 0
                            ? user.roles.join(', ')
                            : '-'}
                    </StatCard>

                    <StatCard
                        icon={BadgeCheck}
                        iconClass={
                            user.email_verified_at ? 'text-emerald-500' : 'text-amber-500'
                        }
                        label="Email Verified"
                    >
                        {user.email_verified_at
                            ? 'Verified'
                            : 'Not Verified'}
                    </StatCard>

                    <StatCard
                        icon={Radar}
                        iconClass={
                            user.is_matching_enabled ? 'text-blue-500' : 'text-slate-400'
                        }
                        label="Matching"
                    >
                        {user.is_matching_enabled
                            ? 'Enabled'
                            : 'Disabled'}
                    </StatCard>

                    <StatCard
                        icon={Home}
                        iconClass="text-orange-500"
                        label="Accommodations"
                    >
                        {user.accommodations_count ?? 0}
                    </StatCard>

                    <StatCard
                        icon={CalendarPlus}
                        iconClass="text-teal-500"
                        label="Created At"
                    >
                        {formatDate(user.created_at)}
                    </StatCard>

                    <StatCard
                        icon={CalendarClock}
                        iconClass="text-teal-500"
                        label="Last Updated"
                    >
                        {formatDate(user.updated_at)}
                    </StatCard>

                    {user.is_deleted && (
                        <StatCard
                            icon={Trash2}
                            iconClass="text-rose-500"
                            label="Deleted At"
                            span
                        >
                            {formatDate(user.deleted_at)}
                        </StatCard>
                    )}

                    <StatCard icon={FileText} label="Bio" span>
                        <p className="whitespace-pre-wrap text-base font-normal text-slate-700">
                            {user.bio || '-'}
                        </p>
                    </StatCard>

                    <StatCard icon={Languages} label="Languages" span>
                        {Array.isArray(user.languages) &&
                        user.languages.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.languages.map((language, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                                    >
                                        {language}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-base font-normal text-slate-400">-</span>
                        )}
                    </StatCard>

                </div>

                {/* Actions card — same shape as "Verification Actions" */}
                <div className="rounded-xl border border-slate-200/70 bg-white p-6">
                    <p className="mb-4 flex items-center gap-2 text-base font-bold text-slate-700">
                        <UserRound className="h-5 w-5 text-slate-400" />
                        Account Actions
                    </p>

                    <div className="flex gap-3">
                        <Link to={`/users/${user.id}/edit`}>
                            <Button>
                                <Pencil className="mr-1.5 inline-block h-4 w-4" />
                                Edit User
                            </Button>
                        </Link>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/users')}
                        >
                            <ArrowLeft className="mr-1.5 inline-block h-4 w-4" />
                            Back to Users
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
