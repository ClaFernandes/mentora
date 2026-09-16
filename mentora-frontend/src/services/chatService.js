import { apiRequest } from "./api";

export async function getConversations(token) {
    return apiRequest("/conversations", {
        method: "GET",
        token,
    });
}

export async function sendMessage(token, offeringId, text, menteeId) {
    return apiRequest(`/offerings/${offeringId}/messages`, {
        method: "POST",
        token,
        body: menteeId ? { text, menteeId } : { text },
    });
}

export async function getAllMessages(token, offeringId) {
    return apiRequest(`/offerings/${offeringId}/messages`, {
        method: "GET",
        token,
    });
}

export async function getMessagesBySender(token, offeringId, senderId) {
    return apiRequest(`/offerings/${offeringId}/messages/${senderId}`, {
        method: "GET",
        token,
    });
}