import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { deleteAccount } from "../services/userService.js";
import ConfirmModal from "./ConfirmModal.jsx";
import "./DangerZoneSection.css";

export default function DangerZoneSection({ variant }) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  async function handleDeleteAccount() {
    setError(null);
    setShowDeleteConfirm(false);
    try {
      await deleteAccount(token);
      logout();
      navigate("/");
    } catch {
      setError("Não foi possível apagar a conta. Tenta novamente.");
    }
  }

  const sectionClass = `${variant}-profile_danger-zone`;
  const buttonClass = `${variant}-profile_delete-account-btn`;
  const errorClass = `${variant}-profile_error`;

  return (
    <section className={sectionClass}>
      <h3>Zona de perigo</h3>
      <p>Apagar a tua conta remove os teus dados de forma permanente.</p>

      {error && <p className={errorClass}>{error}</p>}

      <button
        type="button"
        className={buttonClass}
        onClick={() => setShowDeleteConfirm(true)}
      >
        Apagar conta
      </button>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Apagar a tua conta?"
          message="Esta ação não pode ser desfeita. Todos os teus dados serão removidos da plataforma."
          confirmLabel="Sim, apagar conta"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </section>
  );
}
