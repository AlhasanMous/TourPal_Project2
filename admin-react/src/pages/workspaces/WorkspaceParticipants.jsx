import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineUsers } from 'react-icons/hi';

import workspaceService from '../../services/workspaceService';
import PageHeader from '../../components/layout/PageHeader';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';

export default function WorkspaceParticipants() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const data = await workspaceService.getWorkspaceParticipants(id);
        setParticipants(data.participants ?? []);
      } catch (err) {
        setError(err.response?.data?.message ?? 'Failed to load participants.');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader
        title={(
          <>
            <HiOutlineUsers className="inline-block mr-3 text-3xl text-teal-600 align-middle" />
            Workspace Participants
          </>
        )}
        subtitle="View workspace members."
      />

      <ErrorMessage message={error} />

      <div className="rounded-lg bg-white p-6 shadow-md border border-gray-100">
        {participants.length === 0 ? (
          <p className="text-gray-500">No participants found.</p>
        ) : (
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">{participant.name?.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-gray-800">{participant.name}</p>
                    <p className="text-sm text-gray-500">{participant.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">{participant.status}</div>
                  <div className="text-xs text-gray-400">{participant.joined_at ? new Date(participant.joined_at).toLocaleDateString() : '-'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button variant="secondary" onClick={() => navigate(`/workspaces/${id}/timeline`)}>
          Back to Timeline
        </Button>
      </div>
    </div>
  );
}
