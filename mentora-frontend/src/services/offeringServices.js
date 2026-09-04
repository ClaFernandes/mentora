import { apiRequest } from "./api";

export async function createOffering(token, offeringData) {
    return apiRequest("/mentors/me/offerings", {
        method: "POST",
        token,
        body: offeringData,
    });
}

export async function updateOffering(token, offeringId, updates) {
    return apiRequest(`/mentors/me/offerings/${offeringId}`, {
        method: "PUT",
        token,
        body: updates,
    });
}

export async function deleteOffering(token, offeringId) {
    return apiRequest(`/mentors/me/offerings/${offeringId}`, {
        method: "DELETE",
        token,
    });
}
