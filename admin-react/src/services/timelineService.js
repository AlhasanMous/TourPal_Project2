import api from './api';

const getTimeline = async (workspaceId) => {
    // admin UI should use admin endpoint to get timeline shape matching admin controllers
    const response = await api.get(
        `/admin/workspaces/${workspaceId}/timeline`
    );

    return response.data;
};

const createTimelineItem = async (workspaceId, data) => {
    const response = await api.post(
        `/workspaces/${workspaceId}/timeline`,
        data
    );

    return response.data;
};

const updateTimelineItem = async (workspaceId, itemId, data) => {
    const response = await api.put(
        `/workspaces/${workspaceId}/timeline/${itemId}`,
        data
    );

    return response.data;
};

const deleteTimelineItem = async (workspaceId, itemId) => {
    const response = await api.delete(
        `/workspaces/${workspaceId}/timeline/${itemId}`
    );

    return response.data;
};

const addParticipant = async (workspaceId, itemId, userId) => {
    const response = await api.post(
        `/workspaces/${workspaceId}/timeline/${itemId}/participants`,
        {
            user_id: userId,
        }
    );

    return response.data;
};

const removeParticipant = async (
    workspaceId,
    itemId,
    userId
) => {
    const response = await api.delete(
        `/workspaces/${workspaceId}/timeline/${itemId}/participants/${userId}`
    );

    return response.data;
};

export default {
    getTimeline,
    createTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    addParticipant,
    removeParticipant,
};
