import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import EmptyState from "./EmptyState.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import { FaTimes, FaUserMinus } from "react-icons/fa";
import "./FollowersModal.css";

export default function FollowersModal({ followers, onClose, onRemove }) {
    const [confirmRemove, setConfirmRemove] = useState(null);

    return (
        <>
            <div className="followers-modal_overlay" onClick={onClose}>
                <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="followers-modal_header">
                        <h3>Seguidores</h3>
                        <button
                            type="button"
                            className="followers-modal_close"
                            onClick={onClose}
                            aria-label="Fechar"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="followers-modal_body">
                        {followers.length === 0 ? (
                            <EmptyState message="Ainda não tens seguidores." />
                        ) : (
                            <ul className="followers-modal_list">
                                {followers.map((follower) => (
                                    <li key={follower._id} className="followers-modal_item">
                                        <Link
                                            to={`/mentorados/${follower._id}`}
                                            className="followers-modal_link"
                                            onClick={onClose}
                                        >
                                            <Avatar
                                                src={follower.avatarUrl}
                                                name={follower.name}
                                                surname={follower.surname}
                                                size={40}
                                            />
                                            <span>{follower.name} {follower.surname}</span>
                                        </Link>

                                        <button
                                            type="button"
                                            className="followers-modal_remove-btn"
                                            onClick={() => setConfirmRemove(follower)}
                                            aria-label={`Remover ${follower.name} dos seguidores`}
                                        >
                                            <FaUserMinus />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {confirmRemove && (
                <ConfirmModal
                    title="Remover este seguidor?"
                    message={`${confirmRemove.name} ${confirmRemove.surname} deixa de te seguir.`}
                    confirmLabel="Sim, remover"
                    onCancel={() => setConfirmRemove(null)}
                    onConfirm={() => {
                        onRemove(confirmRemove._id);
                        setConfirmRemove(null);
                    }}
                />
            )}
        </>
    );
}