import { apiRequest } from "./api";

export async function addFavorite(token, offeringId) {
    return apiRequest(`/offerings/${offeringId}/favorite`, {
        method: "POST",
        token,
    });
}

export async function removeFavorite(token, offeringId) {
    return apiRequest(`/offerings/${offeringId}/favorite`, {
        method: "DELETE",
        token,
    });
}

export async function getFavorites(token) {
    return apiRequest("/mentees/me/favorites", {
        method: "GET",
        token,
    });
}