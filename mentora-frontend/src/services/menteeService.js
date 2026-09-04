import { apiRequest } from "./api";

export async function getMenteeProfile(id) {
    return apiRequest(`/mentees/${id}`);
}

export async function updateMenteeProfile(token, updates) {
    return apiRequest("/mentees/me", {
        method: "PUT",
        token,
        body: updates,
    });
}