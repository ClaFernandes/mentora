import { apiRequest } from "./api";

export async function getNotifications(token) {
    return apiRequest("/notifications", {
        method: "GET",
        token,
    });
}

export async function markNotificationAsRead(token, notificationId) {
    return apiRequest(`/notifications/${notificationId}/read`, {
        method: "PUT",
        token,
    });
}

export async function markAllNotificationsAsRead(token) {
    return apiRequest("/notifications/read-all", {
        method: "PUT",
        token,
    });
}