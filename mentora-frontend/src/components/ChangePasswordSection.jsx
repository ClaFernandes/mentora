import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { changePassword } from "../services/authService.js";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./ChangePasswordSection.css";

export default function ChangePasswordSection({ variant }) {
    const { token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fieldClass = `${variant}-profile_change-password-field`;
    const toggleClass = `${variant}-profile_change-password-toggle`;
    const errorClass = `${variant}-profile_error`;

    function resetForm() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSubmitting(true);

        try {
            await changePassword({ token, currentPassword, newPassword, confirmNewPassword });
            setSuccess("Palavra-passe alterada com sucesso.");
            resetForm();
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Não foi possível alterar a palavra-passe. Tenta novamente.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className={`${variant}-profile_change-password`}>
            <h3>Palavra-passe</h3>

            {!isEditing && (
                <div className={`${variant}-profile_change-password-view`}>
                    <p>Altera a palavra-passe usada para entrar na tua conta.</p>
                    <button
                        type="button"
                        className={`${variant}-profile_change-password-btn`}
                        onClick={() => {
                            setSuccess(null);
                            setIsEditing(true);
                        }}
                    >
                        Alterar palavra-passe
                    </button>
                </div>
            )}

            {success && <p className={`${variant}-profile_change-password-success`}>{success}</p>}

            {isEditing && (
                <form onSubmit={handleSubmit} className={`${variant}-profile_change-password-form`}>
                    {error && <p className={errorClass}>{error}</p>}

                    <div className={fieldClass}>
                        <input
                            type={showCurrent ? "text" : "password"}
                            placeholder="Palavra-passe atual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={toggleClass}
                            onClick={() => setShowCurrent((prev) => !prev)}
                            aria-label={showCurrent ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                        >
                            {showCurrent ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className={fieldClass}>
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="Nova palavra-passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={toggleClass}
                            onClick={() => setShowNew((prev) => !prev)}
                            aria-label={showNew ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                        >
                            {showNew ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className={fieldClass}>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirmar nova palavra-passe"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={toggleClass}
                            onClick={() => setShowConfirm((prev) => !prev)}
                            aria-label={showConfirm ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                        >
                            {showConfirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className={`${variant}-profile_change-password-actions`}>
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setError(null);
                                setIsEditing(false);
                            }}
                        >
                            Cancelar
                        </button>
                        <button type="submit" disabled={submitting}>
                            {submitting ? "A guardar..." : "Guardar"}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}