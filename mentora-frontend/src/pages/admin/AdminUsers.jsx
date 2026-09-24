import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { AiFillStar } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";

export default function AdminUsers({
  pendingMentors,
  approvedMentors,
  mentees,
  approvedMentorsPage,
  approvedMentorsTotalPages,
  approvedMentorsTotal,
  setApprovedMentorsPage,
  menteesPage,
  menteesTotal,
  menteesTotalPages,
  setMenteesPage,
  handleApproveMentor,
  handleRequestRejectMentor,
  handleRequestStatusChange,
  handleRequestDeleteAccount,
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
              <div key={mentor._id} className="admin-mentor-item">
                <Avatar
                  src={mentor.avatarUrl}
                  name={mentor.name}
                  surname={mentor.surname}
                  size={48}
                />
                <div className="admin-mentor-info">
                  <h4>
                    {mentor.name} {mentor.surname}
                  </h4>
                  <p>{mentor.bio}</p>
                </div>
                <div className="admin-mentor-actions">
                  <button
                    type="button"
                    className="admin-approve-btn"
                    onClick={() => handleApproveMentor(mentor._id)}
                  >
                    Aprovar
                  </button>

                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() =>
                      handleRequestRejectMentor(
                        mentor._id,
                        `${mentor.name} ${mentor.surname}`,
                      )
                    }
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
          <span className="admin-section-count">{approvedMentorsTotal}</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Avaliação</th>
              <th>Seguidores</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {approvedMentors.map((mentor) => (
              <tr key={mentor._id}>
                <td>
                  <div className="admin-table-name">
                    <Avatar
                      src={mentor.avatarUrl}
                      name={mentor.name}
                      surname={mentor.surname}
                      size={28}
                    />
                    {mentor.name} {mentor.surname}
                  </div>
                </td>
                <td>
                  <AiFillStar style={{ color: "var(--color-mustard)" }} />{" "}
                  {mentor.avgRating}
                </td>
                <td>{mentor.followersCount}</td>
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
                        handleRequestStatusChange(
                          "mentor",
                          mentor._id,
                          `${mentor.name} ${mentor.surname}`,
                          mentor.status,
                        )
                      }
                    >
                      {mentor.status === "active" ? "Suspender" : "Reativar"}
                    </button>
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() =>
                        handleRequestDeleteAccount(
                          "mentor",
                          mentor._id,
                          `${mentor.name} ${mentor.surname}`,
                        )
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {approvedMentorsTotalPages > 1 && (
          <div className="admin-pagination">
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={approvedMentorsPage <= 1}
              onClick={() => setApprovedMentorsPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span className="admin-pagination-info">
              Página {approvedMentorsPage} de {approvedMentorsTotalPages}
            </span>
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={approvedMentorsPage >= approvedMentorsTotalPages}
              onClick={() => setApprovedMentorsPage((p) => p + 1)}
            >
              Seguinte
            </button>
          </div>
        )}
      </div>
      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Mentorados</h3>
          <span className="admin-section-count">{menteesTotal}</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sessões concluídas</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((mentee) => (
              <tr key={mentee._id}>
                <td>
                  <div className="admin-table-name">
                    <Avatar
                      src={mentee.avatarUrl}
                      name={mentee.name}
                      surname={mentee.surname}
                      size={28}
                    />
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
                <td>
                  {" "}
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className={
                        mentee.status === "active"
                          ? "admin-suspend-btn"
                          : "admin-reactivate-btn"
                      }
                      onClick={() =>
                        handleRequestStatusChange(
                          "mentee",
                          mentee._id,
                          `${mentee.name} ${mentee.surname}`,
                          mentee.status,
                        )
                      }
                    >
                      {mentee.status === "active" ? "Suspender" : "Reativar"}
                    </button>
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() =>
                        handleRequestDeleteAccount(
                          "mentee",
                          mentee._id,
                          `${mentee.name} ${mentee.surname}`,
                        )
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {menteesTotalPages > 1 && (
          <div className="admin-pagination">
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={menteesPage <= 1}
              onClick={() => setMenteesPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span className="admin-pagination-info">
              Página {menteesPage} de {menteesTotalPages}
            </span>
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={menteesPage >= menteesTotalPages}
              onClick={() => setMenteesPage((p) => p + 1)}
            >
              Seguinte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
