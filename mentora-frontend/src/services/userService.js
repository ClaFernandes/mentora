import { apiRequest } from "./api";

export async function deleteAccount(token) {
    return apiRequest("/users/me", {
        method: "DELETE",
        token,
    });
}

export async function updateAvatar(token, avatarUrl) {
    return apiRequest("/users/me/avatar", {
        method: "PUT",
        token,
        body: { avatarUrl },
    });
}