import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { FaPen, FaTrash, FaCheck, FaTimes, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiFlag } from "react-icons/fi";
import "./CommentList.css";

export default function CommentList({
  comments,
  currentUserId,
  onEdit,
  onDelete,
  onAdd,
  onReport,
  onToggleLike,
  postId,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  function startEditing(comment) {
    setEditingId(comment._id);
    setEditText(comment.text);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditText("");
  }

  function saveEdit(commentId) {
    onEdit(commentId, editText);
    setEditingId(null);
    setEditText("");
  }

  function handleSubmitComment(e) {
    e.preventDefault();
    if (newCommentText.trim() === "") return;
    onAdd(postId, newCommentText.trim());
    setNewCommentText("");
  }

  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p className="comment-list_empty">Ainda não há comentários.</p>
      ) : (
        <ul>
          {comments.map((comment) => {
            const author = comment.userId;

            const isOwnComment = comment.userId._id === currentUserId;
            const isEditing = editingId === comment._id;
            const isMentor = author.role === "mentor";

            const commentLikedBy = comment.likedBy || [];
            const commentIsLiked = commentLikedBy.includes(currentUserId);
            const commentLikesCount = commentLikedBy.length;

            return (
              <li key={comment._id} className="comment-list_item">
                <Avatar src={author.avatarUrl} name={author.name} size={28} />

                <div className="comment-list_body">
                  <div className="comment-list_meta">
                    <div className="comment-list_meta-info">
                      {isMentor ? (
                        <Link to={`/mentores/${author._id}`}>{author.name}</Link>
                      ) : (
                        <Link to={`/mentorados/${author._id}`}>
                          {author.name}
                        </Link>
                      )}
                      <time>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: pt,
                        })}
                      </time>
                    </div>

                    {isOwnComment && !isEditing && (
                      <div className="comment-list_actions">
                        <button
                          onClick={() => startEditing(comment)}
                          aria-label="Editar comentário"
                        >
                          <FaPen />
                        </button>
                        <button
                          onClick={() => onDelete(comment._id)}
                          aria-label="Apagar comentário"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="comment-list_edit">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="comment-list_edit-actions">
                        <button
                          onClick={() => saveEdit(comment._id)}
                          aria-label="Guardar"
                        >
                          <FaCheck />
                        </button>
                        <button onClick={cancelEditing} aria-label="Cancelar">
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{comment.text}</p>

                      <div className="comment-list_footer">
                        <button
                          type="button"
                          className="comment-list_like-btn"
                          onClick={() => onToggleLike(comment._id)}
                        >
                          {commentIsLiked ? <FaHeart /> : <FaRegHeart />} {commentLikesCount}
                        </button>

                        {!isOwnComment && (
                          <button
                            type="button"
                            className="comment-list_report-btn"
                            onClick={() => onReport(comment._id)}
                            disabled={comment.reported}
                          >
                            <FiFlag /> {comment.reported ? "Denunciado" : "Denunciar"}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form className="comment-list_new" onSubmit={handleSubmitComment}>
        <textarea
          placeholder="Escreve um comentário..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button type="submit" aria-label="Enviar comentário">
          <FaCheck />
        </button>
      </form>
    </div>
  );
}
