import { apiRequest } from "./api";

export async function getAvailability(id) {
    return apiRequest(`/mentors/${id}/availability`);
}

export async function createAvailability(token, blockData) {
    return apiRequest("/mentors/me/availability", {
        method: "POST",
        token,
        body: blockData,
    });
}

export async function deleteAvailability(token, availabilityId) {
    return apiRequest(`/mentors/me/availability/${availabilityId}`, {
        method: "DELETE",
        token,
    });
}

export async function getAvailableSlots(mentorId, date) {
    return apiRequest(`/mentors/${mentorId}/availability/${date}/slots`);
}


