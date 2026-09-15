import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { FiCheck, FiX, FiTrash2 } from "react-icons/fi";

export default function AdminModeration({
    reportedPosts,
    reportedComments,
    reportedContentCount,
    handleDismissReport,
    handleRemoveContent,
    mentors,
    mentees,
    visibleModMentors,
    visibleModMentees,
    showAllModMentors,
    showAllModMentees,
    setShowAllModMentors,
    setShowAllModMentees,
    handleRequestStatusChange,
    handleRequestDeleteAccount,
}) {
    return (
        <div>
            <div className="admin-section">
                <div className="admin-section-header">
                    <h3>Conteúdo denunciado</h3>
                    <span className="admin-section-count admin-section-count--pending">
                        {reportedContentCount}
                    </span>
                </div>

                {reportedContentCount === 0 ? (
                    <EmptyState message="Sem conteúdo denunciado." />
                ) : (
                    <div className="admin-reported-list">
                        {reportedPosts.map((post) => (
                            <div key={post.id} className="admin-reported-item">
                                <span className="admin-reported-type">Post</span>
                                <p className="admin-reported-content">{post.content}</p>
                                <div className="admin-reported-actions">
                                    <button
                                        type="button"
                                        className="admin-dismiss-btn"
                                        onClick={() => handleDismissReport("post", post.id)}
                                    >
                                        <FiCheck /> Rejeitar denúncia
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-remove-btn"
                                        onClick={() => handleRemoveContent("post", post.id)}
                                    >
                                        <FiX /> Remover
                                    </button>
                                </div>
                            </div>
                        ))}

                        {reportedComments.map((comment) => (
                            <div key={comment.id} className="admin-reported-item">
                                <span className="admin-reported-type">Comentário</span>
                                <p className="admin-reported-content">{comment.text}</p>
                                <div className="admin-reported-actions">
                                    <button
                                        type="button"
                                        className="admin-dismiss-btn"
                                        onClick={() => handleDismissReport("comment", comment.id)}
                                    >
                                        <FiCheck /> Rejeitar denúncia
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-remove-btn"
                                        onClick={() => handleRemoveContent("comment", comment.id)}
                                    >
                                        <FiX /> Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div className="admin-section-header">
                    <h3>Contas de mentores</h3>
                    <span className="admin-section-count">{mentors.length}</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleModMentors.map((mentor) => (
                            <tr key={mentor.id}>
                                <td>
                                    <div className="admin-table-name">
                                        <Avatar src={mentor.avatarUrl} name={mentor.name} surname={mentor.surname} size={28} />
                                        {mentor.name} {mentor.surname}
                                    </div>
                                </td>
                                <td>
                                    <span className={`admin-badge admin-badge--${mentor.status}`}>
                                        <span className="admin-badge-dot" />
                                        {mentor.status === "active" ? "ativo" : "suspenso"}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button
                                            type="button"
                                            className={
                                                mentor.status === "active"
                                                    ? "admin-suspend-btn"
                                                    : "admin-reactivate-btn"
                                            }
                                            onClick={() =>
                                                handleRequestStatusChange("mentor", mentor.id, `${mentor.name} ${mentor.surname}`, mentor.status)
                                            }
                                        >
                                            {mentor.status === "active" ? "Suspender" : "Reativar"}
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-delete-btn"
                                            onClick={() => handleRequestDeleteAccount("mentor", mentor.id, `${mentor.name} ${mentor.surname}`)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!showAllModMentors && mentors.length > 5 && (
                    <button
                        type="button"
                        className="admin-show-more-btn"
                        onClick={() => setShowAllModMentors(true)}
                    >
                        Ver mais ({mentors.length - 5})
                    </button>
                )}
            </div>

            <div className="admin-section">
                <div className="admin-section-header">
                    <h3>Contas de mentorados</h3>
                    <span className="admin-section-count">{mentees.length}</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleModMentees.map((mentee) => (
                            <tr key={mentee.id}>
                                <td>
                                    <div className="admin-table-name">
                                        <Avatar src={mentee.avatarUrl} name={mentee.name} surname={mentee.surname} size={28} />
                                        {mentee.name} {mentee.surname}
                                    </div>
                                </td>
                                <td>
                                    <span className={`admin-badge admin-badge--${mentee.status}`}>
                                        <span className="admin-badge-dot" />
                                        {mentee.status === "active" ? "ativo" : "suspenso"}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button
                                            type="button"
                                            className={
                                                mentee.status === "active"
                                                    ? "admin-suspend-btn"
                                                    : "admin-reactivate-btn"
                                            }
                                            onClick={() =>
                                                handleRequestStatusChange("mentee", mentee.id, `${mentee.name} ${mentee.surname}`, mentee.status)
                                            }
                                        >
                                            {mentee.status === "active" ? "Suspender" : "Reativar"}
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-delete-btn"
                                            onClick={() => handleRequestDeleteAccount("mentee", mentee.id, `${mentee.name} ${mentee.surname}`)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!showAllModMentees && mentees.length > 5 && (
                    <button
                        type="button"
                        className="admin-show-more-btn"
                        onClick={() => setShowAllModMentees(true)}
                    >
                        Ver mais ({mentees.length - 5})
                    </button>
                )}
            </div>
        </div>
    );
}
