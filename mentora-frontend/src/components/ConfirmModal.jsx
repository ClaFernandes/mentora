import { FiAlertTriangle, FiCheck } from "react-icons/fi";
import "./ConfirmModal.css";

export default function ConfirmModal({
    title,
    message,
    confirmLabel = "Sim, confirmar",
    onCancel,
    onConfirm,
}) {
    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-icon">
                    <FiAlertTriangle size={22} />
                </div>

                <h3>{title}</h3>
                <p>{message}</p>

                <div className="confirm-modal-actions">
                    <button type="button" className="confirm-modal-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="confirm-modal-confirm" onClick={onConfirm}>
                        <FiCheck /> {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
