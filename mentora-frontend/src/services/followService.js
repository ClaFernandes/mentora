import { apiRequest } from "./api";

export async function followMentor(token, mentorId) {
    return apiRequest(`/mentors/${mentorId}/follow`, {
        method: "POST",
        token,
    });
}

export async function unfollowMentor(token, mentorId) {
    return apiRequest(`/mentors/${mentorId}/follow`, {
        method: "DELETE",
        token,
    });
}