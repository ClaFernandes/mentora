import { createContext, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { MOCK_NOTIFICATIONS } from "../mocks/mockData.js";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const myNotifications = user
        ? notifications.filter((n) => n.recipientId === user.id)
        : [];

    const unreadCount = myNotifications.filter((n) => !n.read).length;

    function markAsRead(notificationId) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    }

    function markAllAsRead() {
        setNotifications((prev) =>
            prev.map((n) =>
                n.recipientId === user?.id ? { ...n, read: true } : n
            )
        );
    }

    function addNotification(notification) {
        setNotifications((prev) => [...prev, notification]);
    }

    const value = useMemo(
        () => ({ notifications: myNotifications, unreadCount, markAsRead, markAllAsRead, addNotification }),
        [myNotifications, unreadCount]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}