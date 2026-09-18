import { apiRequest } from "./api";

export async function createSession(token, sessionData) {
    return apiRequest("/sessions", {
        method: "POST",
        token,
        body: sessionData,
    });
}

export async function getSessions(token) {
    return apiRequest("/sessions", {
        method: "GET",
        token,
    });
}

export async function cancelSession(token, sessionId) {
    return apiRequest(`/sessions/${sessionId}/cancel`, {
        method: "PUT",
        token,
    });
}

export async function rateSession(token, sessionId, { rating, reviewText }) {
    return apiRequest(`/sessions/${sessionId}/rate`, {
        method: "PUT",
        token,
        body: { rating, reviewText },
    });
}

export async function paySession(token, sessionId) {
    return apiRequest(`/sessions/${sessionId}/pay`, {
        method: "POST",
        token,
    });
}