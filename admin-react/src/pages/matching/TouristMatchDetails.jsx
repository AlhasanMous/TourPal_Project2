import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import matchingService from '../../services/matchingService';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function TouristMatchDetails() {
    const { id } = useParams();

    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMatch = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await matchingService.getMatches({
                page: 1,
            });

            const foundMatch = (data.matches ?? []).find(
                (item) => String(item.id) === String(id)
            );

            if (!foundMatch) {
                setError('Tourist match not found.');
                setMatch(null);
                return;
            }

            setMatch(foundMatch);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load match details.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatch();
    }, [id]);

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-amber-200';

            case 'connected':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

            case 'declined':
                return 'bg-rose-50 text-rose-700 ring-rose-200';

            default:
                return 'bg-slate-50 text-slate-600 ring-slate-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';

            case 'connected':
                return 'Connected';

            case 'declined':
                return 'Declined';

            default:
                return status ?? '-';
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader
                title={`Match #${id}`}
                subtitle="View tourist match details."
            />

            <ErrorMessage message={error} />

            {match && (
                <>
                    {/* Back */}
                    <div className="mb-6">
                        <Link to="/matching">
                            <Button variant="secondary">
                                ← Back to Matches
                            </Button>
                        </Link>
                    </div>

                    {/* Match Overview */}
                    <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Match ID
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                                    #{match.id}
                                </h2>
                            </div>

                            <span
                                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${getStatusClass(
                                    match.status
                                )}`}
                            >
                                <span className="h-2 w-2 rounded-full bg-current" />

                                {getStatusLabel(match.status)}
                            </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-slate-400">
                                    City
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {match.city ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Workspace
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {match.workspace ?? '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Created At
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {formatDate(match.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tourists */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Tourist 1 */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
                                Tourist 1
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-lg font-semibold text-indigo-700 ring-2 ring-indigo-100">
                                    {match.user1?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ?? '?'}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {match.user1?.name ?? '-'}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {match.user1?.email ?? '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-400">
                                    User ID
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    #{match.user1?.id ?? '-'}
                                </p>
                            </div>
                        </div>

                        {/* Tourist 2 */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
                                Tourist 2
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-lg font-semibold text-teal-700 ring-2 ring-teal-100">
                                    {match.user2?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ?? '?'}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {match.user2?.name ?? '-'}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {match.user2?.email ?? '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-400">
                                    User ID
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    #{match.user2?.id ?? '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
