import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { AiFillStar } from "react-icons/ai";

export default function AdminUsers({
    pendingMentors,
    approvedMentors,
    mentees,
    visibleMentors,
    visibleMentees,
    showAllMentors,
    showAllMentees,
    setShowAllMentors,
    setShowAllMentees,
    handleApproveMentor,
    handleRequestRejectMentor,
}) {
    return (
        <div>
            <div className="admin-section">
                <div className="admin-section-header">
                    <h3>Por aprovar</h3>
                    <span className="admin-section-count admin-section-count--pending">
                        {pendingMentors.length}
                    </span>
                </div>

                {pendingMentors.length === 0 ? (
                    <EmptyState message="Sem mentores por aprovar." />
                ) : (
                    <div className="admin-mentors-list">
                        {pendingMentors.map((mentor) => (
                            <div key={mentor.id} className="admin-mentor-item">
                                <Avatar src={mentor.avatarUrl} name={mentor.name} surname={mentor.surname} size={48} />
                                <div className="admin-mentor-info">
                                    <h4>{mentor.name} {mentor.surname}</h4>
                                    <p>{mentor.bio}</p>
                                </div>
                                <div className="admin-mentor-actions">
                                    <button
                                        type="button"
                                        className="admin-approve-btn"
                                        onClick={() => handleApproveMentor(mentor.id)}
                                    >
                                        Aprovar
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-remove-btn"
                                        onClick={() => handleRequestRejectMentor(mentor.id, `${mentor.name} ${mentor.surname}`)}
                                    >
                                        Rejeitar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div className="admin-section-header">
                    <h3>Mentores aprovados</h3>
                    <span className="admin-section-count">{approvedMentors.length}</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Avaliação</th>
                            <th>Seguidores</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleMentors.map((mentor) => (
                            <tr key={mentor.id}>
                                <td>
                                    <div className="admin-table-name">
                                        <Avatar src={mentor.avatarUrl} name={mentor.name} surname={mentor.surname} size={28} />
                                        {mentor.name} {mentor.surname}
                                    </div>
                                </td>
                                <td>
                                    <AiFillStar style={{ color: "var(--color-mustard)" }} /> {mentor.avgRating}
                                </td>
                                <td>{mentor.followersCount}</td>
                                <td>
                                    <span className={`admin-badge admin-badge--${mentor.status}`}>
                                        <span className="admin-badge-dot" />
                                        {mentor.status === "active" ? "ativo" : "suspenso"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!showAllMentors && approvedMentors.length > 5 && (
                    <button
                        type="button"
                        className="admin-show-more-btn"
                        onClick={() => setShowAllMentors(true)}
                    >
                        Ver mais ({approvedMentors.length - 5})
                    </button>
                )}
            </div>

            <div className="admin-section">
                <div className="admin-section-header">
                    <h3>Mentorados</h3>
                    <span className="admin-section-count">{mentees.length}</span>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Sessões concluídas</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleMentees.map((mentee) => (
                            <tr key={mentee.id}>
                                <td>
                                    <div className="admin-table-name">
                                        <Avatar src={mentee.avatarUrl} name={mentee.name} surname={mentee.surname} size={28} />
                                        {mentee.name} {mentee.surname}
                                    </div>
                                </td>
                                <td>{mentee.completedSessions}</td>
                                <td>
                                    <span className={`admin-badge admin-badge--${mentee.status}`}>
                                        <span className="admin-badge-dot" />
                                        {mentee.status === "active" ? "ativo" : "suspenso"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!showAllMentees && mentees.length > 5 && (
                    <button
                        type="button"
                        className="admin-show-more-btn"
                        onClick={() => setShowAllMentees(true)}
                    >
                        Ver mais ({mentees.length - 5})
                    </button>
                )}
            </div>
        </div>
    );
}
