import EmptyState from "../../components/EmptyState.jsx";
import { FiCheck, FiX } from "react-icons/fi";

export default function AdminModeration({
  reportedPosts,
  reportedComments,
  reportedContentCount,
  handleDismissReport,
  handleRequestRemoveContent,
  reportedPage,
  reportedTotalPages,
  setReportedPage,
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
              <div key={post._id} className="admin-reported-item">
                <span className="admin-reported-type">Post</span>
                <p className="admin-reported-content">{post.content}</p>
                <div className="admin-reported-actions">
                  <button
                    type="button"
                    className="admin-dismiss-btn"
                    onClick={() => handleDismissReport("post", post._id)}
                  >
                    <FiCheck /> Rejeitar denúncia
                  </button>
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() => handleRequestRemoveContent("post", post._id)}
                  >
                    <FiX /> Remover
                  </button>
                </div>
              </div>
            ))}

            {reportedComments.map((comment) => (
              <div key={comment._id} className="admin-reported-item">
                <span className="admin-reported-type">Comentário</span>
                <p className="admin-reported-content">{comment.text}</p>
                <div className="admin-reported-actions">
                  <button
                    type="button"
                    className="admin-dismiss-btn"
                    onClick={() => handleDismissReport("comment", comment._id)}
                  >
                    <FiCheck /> Rejeitar denúncia
                  </button>
                  <button
                    type="button"
                    className="admin-remove-btn"
                    onClick={() => handleRequestRemoveContent("comment", comment._id)}
                  >
                    <FiX /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportedTotalPages > 1 && (
          <div className="admin-pagination">
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={reportedPage <= 1}
              onClick={() => setReportedPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span className="admin-pagination-info">
              Página {reportedPage} de {reportedTotalPages}
            </span>
            <button
              type="button"
              className="admin-pagination-btn"
              disabled={reportedPage >= reportedTotalPages}
              onClick={() => setReportedPage((p) => p + 1)}
            >
              Seguinte
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
