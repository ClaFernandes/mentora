import { createContext, useState, useMemo, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../services/notificationService.js";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user || !token) {
            setNotifications([]);
            return;
        }

        getNotifications(token).then(setNotifications);
    }, [user, token]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    async function markAsRead(notificationId) {
        await markNotificationAsRead(token, notificationId);

        setNotifications((prev) =>
            prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
    }

    async function markAllAsRead() {
        await markAllNotificationsAsRead(token);

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true })));
    }

    const value = useMemo(
        () => ({ notifications, unreadCount, markAsRead, markAllAsRead }),
        [notifications, unreadCount]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}