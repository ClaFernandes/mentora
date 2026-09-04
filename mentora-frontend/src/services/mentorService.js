import { apiRequest } from "./api";

export async function updateMentorProfile(token, updates) {
    return apiRequest("/mentors/me", {
        method: "PUT",
        token,
        body: updates,
    });
}

export async function getMentorProfile(id) {
    return apiRequest(`/mentors/${id}`);
}