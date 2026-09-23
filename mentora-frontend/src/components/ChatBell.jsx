import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getConversations, markConversationAsRead } from "../services/chatService.js";
import Avatar from "./Avatar.jsx";
import { FiMessageCircle } from "react-icons/fi";
import "./ChatBell.css";

export default function ChatBell() {
    const { user, token } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !token) return;

        getConversations(token)
            .then(setConversations)
            .catch(() => {
            });
    }, [user, token]);

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

    const unreadConversations = conversations.filter((conv) => conv.hasUnread);
    const unreadCount = unreadConversations.length;

    async function handleConversationClick(conv) {
        setIsOpen(false);

        try {
            await markConversationAsRead(token, conv.id);

            setConversations((prev) =>
                prev.map((c) => (c.id === conv.id ? { ...c, hasUnread: false } : c))
            );
        } catch {
            // se falhar, abre o chat na mesma
        }

        navigate("/chat", { state: { offeringId: conv.offering.id } });
    }

    const sortedConversations = [...unreadConversations];

    return (
        <div className="chat-bell" ref={wrapperRef}>
            <button type="button" className="chat-bell_trigger" onClick={toggleOpen}>
                <FiMessageCircle />
                {unreadCount > 0 && (
                    <span className="chat-bell_badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="chat-bell_dropdown">
                    <div className="chat-bell_header">
                        <span>Mensagens</span>
                    </div>

                    {sortedConversations.length === 0 ? (
                        <p className="chat-bell_empty">Sem mensagens novas.</p>
                    ) : (
                        <ul>
                            {sortedConversations.map((conv) => (
                                <li
                                    key={conv.id}
                                    className="chat-bell_item"
                                    onClick={() => handleConversationClick(conv)}
                                >
                                    <Avatar
                                        src={conv.otherUser.avatarUrl}
                                        name={conv.otherUser.name}
                                        surname={conv.otherUser.surname}
                                        size={32}
                                    />
                                    <span className="chat-bell_item-text">
                                        <strong>
                                            {conv.otherUser.name} {conv.otherUser.surname}
                                        </strong>
                                        <small>{conv.offering.title}</small>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}