import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useNotifications } from "../hooks/useNotifications.js";
import { findAuthorById } from "../utils/authorHelpers.js";
import { findOrCreateConversation } from "../utils/conversationHelpers.js";
import { FiBell } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import "./NotificationBell.css";

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toggleOpen() {
        setIsOpen((prev) => !prev);
    }

    function handleNotificationClick(notification) {
        markAsRead(notification.id);

        if (notification.type === "message") {
            let mentorId;
            let menteeId;

            if (user.role === "mentor") {
                mentorId = user.id;
                menteeId = notification.actorId;
            } else {
                mentorId = notification.actorId;
                menteeId = user.id;
            }

            const conversation = findOrCreateConversation(mentorId, menteeId);
            navigate("/chat", { state: { conversationId: conversation.id } });
        }
    }

    function getMessage(notification) {
        const actor = findAuthorById(notification.actorId);
        const actorName = actor ? actor.name : "Alguém";

        if (notification.type === "like") {
            return `${actorName} gostou da tua publicação`;
        }
        if (notification.type === "comment") {
            return `${actorName} comentou na tua publicação`;
        }
        if (notification.type === "message") {
            return `${actorName} enviou-te uma mensagem`;
        }

        return `${actorName} interagiu contigo`;
    }

    const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="notification-bell" ref={wrapperRef}>
            <button type="button" className="notification-bell_trigger" onClick={toggleOpen}>
                <FiBell />
                {unreadCount > 0 && (
                    <span className="notification-bell_badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-bell_dropdown">
                    <div className="notification-bell_header">
                        <span>Notificações</span>
                        {unreadCount > 0 && (
                            <button type="button" onClick={markAllAsRead}>
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    {sortedNotifications.length === 0 ? (
                        <p className="notification-bell_empty">Sem notificações.</p>
                    ) : (
                        <ul>
                            {sortedNotifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className={
                                        notification.read
                                            ? "notification-bell_item"
                                            : "notification-bell_item notification-bell_item-unread"
                                    }
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <p>{getMessage(notification)}</p>
                                    <time>
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: pt })}
                                    </time>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}