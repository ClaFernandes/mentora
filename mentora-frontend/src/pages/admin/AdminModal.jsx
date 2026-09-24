import { FiCheck, FiAlertTriangle } from "react-icons/fi";

export default function AdminModal({ confirmAction, onCancel, onConfirm }) {
    if (!confirmAction) {
        return null;
    }

    return (
        <div className="admin-modal-overlay" onClick={onCancel}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-icon">
                    <FiAlertTriangle size={22} />
                </div>

                {confirmAction.kind === "status" && (
                    <>
                        <h3>
                            {confirmAction.currentStatus === "active" ? "Suspender" : "Reativar"} conta?
                        </h3>
                        <p>
                            {confirmAction.currentStatus === "active"
                                ? `${confirmAction.name} vai perder acesso à plataforma imediatamente.`
                                : `${confirmAction.name} vai voltar a ter acesso normal à plataforma.`}
                        </p>
                    </>
                )}

                {confirmAction.kind === "delete-account" && (
                    <>
                        <h3>Apagar conta permanentemente?</h3>
                        <p>
                            Esta ação não pode ser desfeita. Todos os dados de {confirmAction.name} serão
                            removidos da plataforma.
                        </p>
                    </>
                )}

                {confirmAction.kind === "remove-admin" && (
                    <>
                        <h3>Remover administrador?</h3>
                        <p>
                            {confirmAction.name} perde imediatamente o acesso ao painel de administração.
                        </p>
                    </>
                )}

                {confirmAction.kind === "reject-mentor" && (
                    <>
                        <h3>Rejeitar candidatura?</h3>
                        <p>
                            {confirmAction.name} não vai ser aprovado(a) como mentor. O registo fica
                            marcado como rejeitado, mas não é apagado.
                        </p>
                    </>
                )}

                {confirmAction.kind === "remove-content" && (
                    <>
                        <h3>Remover conteúdo?</h3>
                        <p>
                            Esta ação não pode ser desfeita. O {confirmAction.type === "post" ? "post" : "comentário"} vai
                            ser apagado permanentemente da plataforma.
                        </p>
                    </>
                )}

                <div className="admin-modal-actions">
                    <button type="button" className="admin-modal-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="button" className="admin-modal-confirm" onClick={onConfirm}>
                        <FiCheck /> Sim, confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}