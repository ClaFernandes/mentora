import { apiRequest } from "./api";

export async function deleteAccount(token) {
    return apiRequest("/users/me", {
        method: "DELETE",
        token,
    });
}