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

export async function searchMentors(filters, page, limit) {
    const params = new URLSearchParams();

    if (filters.area) params.append("area", filters.area);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.minRating) params.append("minRating", filters.minRating);
    if (filters.q) params.append("q", filters.q);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    params.append("page", page);
    params.append("limit", limit);

    return apiRequest(`/mentors?${params.toString()}`, {
        method: "GET",
    });
}