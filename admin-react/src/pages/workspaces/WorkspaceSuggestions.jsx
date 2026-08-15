import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';

import workspaceService from '../../services/workspaceService';

import PageHeader from '../../components/layout/PageHeader';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';


export default function WorkspaceSuggestions() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {

        const fetchSuggestions = async () => {

            try {

                setLoading(true);
                setError('');

                const data =
                    await workspaceService.getWorkspaceSuggestions(id);


                setSuggestions(
                    data.suggestions ?? []
                );


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


            <div className="rounded-lg bg-white p-6 shadow-md border border-gray-100">
                {suggestions.length === 0 ? (
                    <p className="text-gray-500">No suggestions found.</p>
                ) : (
                    <div className="space-y-4">
                        {suggestions.map((suggestion) => (
                            <div key={suggestion.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800">{suggestion.title ?? 'Suggestion'}</h3>
                                    <span className="inline-block rounded-full bg-white/60 px-3 py-1 text-xs text-gray-700">{suggestion.status}</span>
                                </div>

                                <p className="mt-2 text-sm text-gray-600">{suggestion.description ?? '-'}</p>

                                {suggestion.payload && (
                                    <pre className="mt-3 max-w-full overflow-auto rounded bg-white p-2 text-xs text-gray-600">{JSON.stringify(suggestion.payload)}</pre>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6">

                <Button
                    variant="secondary"
                    onClick={() =>
                        navigate(`/workspaces/${id}/timeline`)
                    }
                >
                    Back to Timeline
                </Button>

            </div>


        </div>

    );

}
