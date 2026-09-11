import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { MOCK_CONVERSATIONS } from "../../mocks/mockData.js";
import { findAuthorById } from "../../utils/authorHelpers.js";
import Avatar from "../../components/Avatar.jsx";
import "./ChatWindow.css";

export default function ChatWindow() {
    const { user } = useAuth();
    const location = useLocation();
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [selectedConversationId, setSelectedConversationId] = useState(
        location.state?.conversationId || null
    );
    const [newMessageText, setNewMessageText] = useState("");

    let myConversations = [];
    if (user.role === "mentor") {
        myConversations = conversations.filter((conv) => conv.mentorId === user.id);
    } else if (user.role === "mentee") {
        myConversations = conversations.filter((conv) => conv.menteeId === user.id);
    }

    const selectedConversation = myConversations.find(
        (conv) => conv.id === selectedConversationId
    );

    function handleSelectConversation(convId) {
        setSelectedConversationId(convId);
        const conv = conversations.find((c) => c.id === convId);
        if (conv) {
            if (user.role === "mentor") {
                conv.unreadByMentor = false;
            } else {
                conv.unreadByMentee = false;
            }
        }
        setConversations([...conversations]);
    }

    function handleSendMessage() {
        if (!newMessageText.trim() || !selectedConversation) {
            return;
        }
        const newMessage = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            text: newMessageText.trim(),
            createdAt: new Date().toISOString(),
        };

        const updatedConversations = conversations.map((conv) => {
            if (conv.id === selectedConversation.id) {
                const updated = { ...conv, messages: [...conv.messages, newMessage] };
                if (user.role === "mentor") {
                    updated.unreadByMentee = true;
                } else {
                    updated.unreadByMentor = true;
                }
                return updated;
            }
            return conv;
        });
        setConversations(updatedConversations);
        setNewMessageText("");
    }

    return (
        <div className="chat-window">
            <div className="chat-conversations-list">
                {myConversations.length === 0 ? (
                    <p className="chat-empty">Ainda não tens conversas.</p>
                ) : (
                    myConversations.map((conv) => {
                        let otherPersonId;
                        if (user.role === "mentor") {
                            otherPersonId = conv.menteeId;
                        } else {
                            otherPersonId = conv.mentorId;
                        }

                        const otherPerson = findAuthorById(otherPersonId);
                        let itemClass = "chat-conversation-item";
                        if (conv.id === selectedConversationId) {
                            itemClass = "chat-conversation-item chat-conversation-item--active";
                        }
                        return (
                            <button
                                key={conv.id}
                                type="button"
                                className={itemClass}
                                onClick={() => handleSelectConversation(conv.id)}
                            >
                                <Avatar src={otherPerson.avatarUrl} name={otherPerson.name} size={40} />
                                <span>{otherPerson.name}</span>
                                {(user.role === "mentor" ? conv.unreadByMentor : conv.unreadByMentee) && (
                                    <span className="chat-unread-dot" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            <div className="chat-conversation-detail">
                {!selectedConversation ? (
                    <p className="chat-empty">Seleciona uma conversa para começar.</p>
                ) : (
                    <>
                        <div className="chat-messages-list">
                            {selectedConversation.messages.map((message) => {
                                let messageClass = "chat-message chat-message--received";
                                if (message.senderId === user.id) {
                                    messageClass = "chat-message chat-message--sent";
                                }

                                return (
                                    <div key={message.id} className={messageClass}>
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