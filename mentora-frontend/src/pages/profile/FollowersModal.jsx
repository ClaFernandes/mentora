import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { FaTimes } from "react-icons/fa";
import "./FollowersModal.css";

export default function FollowersModal({ followers, onClose }) {
    return (
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
                                    <Avatar
                                        src={follower.avatarUrl}
                                        name={follower.name}
                                        surname={follower.surname}
                                        size={40}
                                    />
                                    <span>{follower.name} {follower.surname}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}