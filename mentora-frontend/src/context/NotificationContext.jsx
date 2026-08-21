import { createContext, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth.js"; // NOVO
import { MOCK_NOTIFICATIONS } from "../mocks/mockData.js";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useAuth(); // NOVO
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    // ALTERADO: só as notificações do utilizador atual
    const myNotifications = user
        ? notifications.filter((n) => n.recipientId === user.id)
        : [];

    const unreadCount = myNotifications.filter((n) => !n.read).length; // ALTERADO: usa myNotifications

    function markAsRead(notificationId) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    }

    function markAllAsRead() {
        // ALTERADO: só marca como lidas as notificações do utilizador atual
        setNotifications((prev) =>
            prev.map((n) =>
                n.recipientId === user?.id ? { ...n, read: true } : n
            )
        );
    }

    const value = useMemo(
        () => ({ notifications: myNotifications, unreadCount, markAsRead, markAllAsRead }), // ALTERADO
        [myNotifications, unreadCount]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}