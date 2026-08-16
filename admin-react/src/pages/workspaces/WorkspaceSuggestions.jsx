import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';

import { getImageUrl } from '../../utils/helpers';
import placeService from '../../services/placeService';
import workspaceService from '../../services/workspaceService';

import PageHeader from '../../components/layout/PageHeader';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';

const suggestionTypeLabels = {
    add_place: 'Add place',
    remove_place: 'Remove place',
    reorder: 'Reorder activity',
    change_hours: 'Change schedule',
    add_note: 'Add note',
    remove_note: 'Remove note',
};

export default function WorkspaceSuggestions() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);
    const [placeDetails, setPlaceDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await workspaceService.getWorkspaceSuggestions(id);
                const suggestionList = data.suggestions ?? [];

                setSuggestions(suggestionList);

                const placeIds = [...new Set(
                    suggestionList
                        .flatMap((suggestion) => {
                            const payload = suggestion.payload ?? {};

                            if (Array.isArray(payload.place_ids)) {
                                return payload.place_ids.filter(Boolean);
                            }

                            if (payload.place_id) {
                                return [payload.place_id];
                            }

                            return [];
                        })
                )];

                const placeMap = {};

                for (const placeId of placeIds) {
                    try {
                        const response = await placeService.getPlace(placeId);
                        const place = response.place ?? response;
                        placeMap[placeId] = place;
                    } catch (placeErr) {
                        console.error('Failed to fetch place for suggestion:', placeErr);
                    }
                }

                setPlaceDetails(placeMap);
            } catch (err) {
                setError(
                    err.response?.data?.message ??
                    'Failed to load suggestions.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [id]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 ring-amber-200';
            case 'accepted':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
            case 'rejected':
                return 'bg-rose-50 text-rose-700 ring-rose-200';
            default:
                return 'bg-slate-50 text-slate-600 ring-slate-200';
        }
    };

    const getSuggestionLabel = (suggestion) => {
        return suggestionTypeLabels[suggestion.type] ?? suggestion.type ?? 'Suggestion';
    };

    const getSuggestionSummary = (suggestion) => {
        const payload = suggestion.payload ?? {};

        if (suggestion.type === 'add_place') {
            return payload.place_id
                ? `Suggested adding a place to the itinerary.`
                : 'Suggested adding a place.';
        }

        if (suggestion.type === 'remove_place') {
            return 'Suggested removing an item from the itinerary.';
        }

        if (suggestion.type === 'add_note') {
            return suggestion.note || 'Suggested adding a note to the itinerary.';
        }

        if (suggestion.type === 'change_hours') {
            return `Requested a time update${payload.planned_time ? ` to ${payload.planned_time}` : ''}.`;
        }

        if (suggestion.type === 'reorder') {
            return 'Suggested reordering the scheduled activity.';
        }

        return suggestion.note || payload?.message || 'Suggestion update';
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <PageHeader
                title={(
                    <>
                        <HiOutlineSparkles className="inline-block mr-3 text-3xl text-yellow-500 align-middle" />
                        Workspace Suggestions
                    </>
                )}
                subtitle="View suggestions for this workspace."
            />

            <ErrorMessage message={error} />

            <div className="space-y-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                {suggestions.length === 0 ? (
                    <p className="text-gray-500">No suggestions found.</p>
                ) : (
                    suggestions.map((suggestion) => {
                        const payload = suggestion.payload ?? {};
                        const placeId = payload.place_id ?? payload.place_ids?.[0];
                        const place = placeId ? placeDetails[placeId] : null;
                        const placeName = place?.name_en || place?.name_ar || 'Suggested place';
                        const placeImage = place?.images?.[0]?.url ?? place?.main_image ?? null;

                        return (
                            <div
                                key={suggestion.id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 border-b border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-100 to-amber-100 text-sm font-bold text-violet-700 ring-2 ring-violet-200">
                                            {suggestion.suggester?.photo ? (
                                                <img
                                                    src={getImageUrl(suggestion.suggester.photo)}
                                                    alt={suggestion.suggester.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                suggestion.suggester?.name?.charAt(0)?.toUpperCase() ?? '?'
                                            )}
                                        </div>

                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {suggestion.suggester?.name ?? 'Unknown user'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {getSuggestionLabel(suggestion)}
                                            </div>
                                        </div>
                                    </div>

                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(suggestion.status)}`}>
                                        {suggestion.status ?? 'pending'}
                                    </span>
                                </div>

                                <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
                                    {place && (
                                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                            <img
                                                src={getImageUrl(placeImage || '/images/no-image.png')}
                                                alt={placeName}
                                                className="h-40 w-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.src = '/images/no-image.png';
                                                }}
                                            />
                                            <div className="p-3">
                                                <div className="font-semibold text-gray-900">{placeName}</div>
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {place.category || 'Place'}
                                                    {place.city ? ` • ${place.city.name_en || place.city.name_ar || place.city.name || ''}` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                Suggestion summary
                                            </div>
                                            <p className="mt-1 text-sm text-gray-700">
                                                {getSuggestionSummary(suggestion)}
                                            </p>
                                        </div>

                                        {suggestion.note && (
                                            <div>
                                                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                    Note
                                                </div>
                                                <p className="mt-1 text-sm text-gray-700">{suggestion.note}</p>
                                            </div>
                                        )}

                                        {payload.planned_date && (
                                            <div className="text-sm text-gray-700">
                                                <span className="font-medium">Planned date:</span> {payload.planned_date}
                                            </div>
                                        )}

                                        {payload.planned_time && (
                                            <div className="text-sm text-gray-700">
                                                <span className="font-medium">Time:</span> {payload.planned_time}
                                            </div>
                                        )}

                                        {payload.rejection_reason && (
                                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                                                Rejection reason: {payload.rejection_reason}
                                            </div>
                                        )}

                                        {suggestion.rejection_reason && (
                                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                                                Rejection reason: {suggestion.rejection_reason}
                                            </div>
                                        )}

                                        {suggestion.payload && Object.keys(payload).length > 0 && (
                                            <details className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600">
                                                <summary className="cursor-pointer font-medium text-gray-700">
                                                    Show raw payload
                                                </summary>
                                                <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-gray-600">
                                                    {JSON.stringify(payload, null, 2)}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-6">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/workspaces/${id}/timeline`)}
                >
                    Back to Timeline
                </Button>
            </div>
        </div>
    );
}
