import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import {
    getConversations,
    sendMessage,
    getMessagesBySender,
} from "../../services/chatService.js";
import { FiArrowLeft } from "react-icons/fi";
import "./ChatWindow.css";

export default function ChatWindow() {
    const { user, token } = useAuth();
    const location = useLocation();

    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        getConversations(token).then((data) => {
            setConversations(data);

            const incomingOfferingId = location.state?.offeringId;
            if (!incomingOfferingId) return;

            const existing = data.find((c) => c.offering.id === incomingOfferingId);

            if (existing) {
                openConversation(existing);
            } else if (location.state.otherUser) {
                const rawOtherUser = location.state.otherUser;
                const placeholder = {
                    id: null,
                    offering: {
                        id: incomingOfferingId,
                        title: location.state.offeringTitle,
                    },
                    otherUser: {
                        id: rawOtherUser._id || rawOtherUser.id,
                        name: rawOtherUser.name,
                        surname: rawOtherUser.surname,
                        avatarUrl: rawOtherUser.avatarUrl,
                    },
                    hasUnread: false,
                };
                setSelectedConv(placeholder);
                setMessages([]);
            } else {
                console.error(
                    "Conversa não encontrada para o offeringId recebido da notificação:",
                    incomingOfferingId,
                );
            }
        })
            .catch(() => setError("Não foi possível carregar as conversas. Tenta novamente."));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    async function openConversation(conv) {
        setError(null);
        setSelectedConv(conv);

        if (!conv.id) {
            setMessages([]);
            return;
        }

        try {
            const senderId = user.role === "mentee" ? user.id : conv.otherUser.id;
            const found = await getMessagesBySender(token, conv.offering.id, senderId);
            setMessages(found);
        } catch {
            setMessages([]);
            setError("Não foi possível carregar as mensagens. Tenta novamente.");
        }
    }

    async function handleSendMessage() {
        if (!newMessageText.trim() || !selectedConv) return;

        const menteeId =
            user.role === "mentor" ? selectedConv.otherUser.id : undefined;

        setError(null);

        try {
            const newMsg = await sendMessage(
                token,
                selectedConv.offering.id,
                newMessageText.trim(),
                menteeId,
            );

            setMessages((prev) => [...prev, newMsg]);
            setNewMessageText("");

            if (!selectedConv.id) {
                try {
                    const updated = await getConversations(token);
                    setConversations(updated);
                    const created = updated.find(
                        (c) =>
                            c.offering.id === selectedConv.offering.id &&
                            c.otherUser.id === selectedConv.otherUser.id,
                    );
                    if (created) setSelectedConv(created);
                } catch {
                    // a lista atualiza-se na próxima vez que abrires o chat
                }
            }
        } catch {
            setError("Não foi possível enviar a mensagem. Tenta novamente.");
        }
    }

    return (
        <div className={selectedConv ? "chat-window chat-window--has-selection" : "chat-window"}>
            <div className="chat-conversations-list">
                {conversations.length === 0 ? (
                    <p className="chat-empty">Ainda não tens conversas.</p>
                ) : (
                    conversations.map((conv) => {
                        let itemClass = "chat-conversation-item";
                        if (selectedConv?.id === conv.id) {
                            itemClass = "chat-conversation-item chat-conversation-item--active";
                        }
                        return (
                            <button
                                key={conv.id}
                                type="button"
                                className={itemClass}
                                onClick={() => openConversation(conv)}
                            >
                                <Avatar
                                    src={conv.otherUser.avatarUrl}
                                    name={conv.otherUser.name}
                                    surname={conv.otherUser.surname}
                                    size={40}
                                />
                                <span className="chat-conversation-item_text">
                                    <strong>
                                        {conv.otherUser.name} {conv.otherUser.surname}
                                    </strong>
                                    <small>{conv.offering.title}</small>
                                </span>
                                {conv.hasUnread && <span className="chat-unread-dot" />}
                            </button>
                        );
                    })
                )}
            </div>

            <div className="chat-conversation-detail">
                {error && <p className="chat-error">{error}</p>}

                {!selectedConv ? (
                    <p className="chat-empty">Seleciona uma conversa para começar.</p>
                ) : (
                    <>
                        <div className="chat-conversation-detail_header">
                            <button
                                type="button"
                                className="chat-back-btn"
                                onClick={() => setSelectedConv(null)}
                                aria-label="Voltar às conversas"
                            >
                                <FiArrowLeft />
                            </button>
                            <Avatar
                                src={selectedConv.otherUser.avatarUrl}
                                name={selectedConv.otherUser.name}
                                surname={selectedConv.otherUser.surname}
                                size={36}
                            />
                            <div>
                                <strong>
                                    {selectedConv.otherUser.name} {selectedConv.otherUser.surname}
                                </strong>
                                <small>{selectedConv.offering.title}</small>
                            </div>
                        </div>

                        <div className="chat-messages-list">
                            {messages.map((message) => {
                                let messageClass = "chat-message chat-message--received";
                                if (message.senderId === user.id) {
                                    messageClass = "chat-message chat-message--sent";
                                }
                                return (
                                    <div key={message._id} className={messageClass}>
                                        <p>{message.text}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="chat-input-row">
                            <input
                                type="text"
                                placeholder="Escreve uma mensagem..."
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button type="button" onClick={handleSendMessage}>
                                Enviar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}