import "./EmptyState.css";

export default function EmptyState({ message, icon }) {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state_icon">{icon}</div>}
            <p>{message}</p>
        </div>
    );
}