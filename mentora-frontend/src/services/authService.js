import { apiRequest } from "./api";

export async function loginUser(email, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
    });
}

export async function registerUser({ email, password, confirmPassword, name, surname, birthDate, role }) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: { email, password, confirmPassword, name, surname, birthDate, role },
    });
}

export async function getCurrentUser(token) {
    return apiRequest("/auth/me", {
        method: "GET",
        token,
    });
}

export async function forgotPassword(email) {
    return apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email },
    });
}

export async function resetPassword({ token, newPassword, confirmNewPassword }) {
    return apiRequest("/auth/reset-password", {
        method: "POST",
        body: { token, newPassword, confirmNewPassword },
    });
}

export async function changePassword({ token, currentPassword, newPassword, confirmNewPassword }) {
    return apiRequest("/auth/change-password", {
        method: "PUT",
        body: { currentPassword, newPassword, confirmNewPassword },
        token,
    });
}