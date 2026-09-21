import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar";
import ConfirmModal from "../../components/ConfirmModal";
import CommentList from "./CommentList";
import {
  getComments,
  createComment,
  editComment,
  deleteComment,
  likeComment,
  reportComment,
} from "../../services/feedService.js";
import { uploadImage } from "../../services/uploadService.js";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import {
  FaHeart,
  FaRegHeart,
  FaPen,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FiFlag,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiImage,
  FiMessageSquare,
} from "react-icons/fi";
import "./PostCard.css";

export default function PostCard({
  post,
  currentUserId,
  onToggleLike,
  onReportPost,
  onEditPost,
  onDeletePost,
}) {
  const { token } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [editedPreviewUrl, setEditedPreviewUrl] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [error, setError] = useState(null);

  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (showComments && !commentsLoaded) {
      setError(null);

      getComments(token, post._id)
        .then((data) => {
          setComments(data);
          setCommentsLoaded(true);
        })
        .catch(() =>
          setError(
            "Não foi possível carregar os comentários. Tenta novamente.",
          ),
        );
    }
  }, [showComments]);

  useEffect(() => {
    if (!editedImage) {
      setEditedPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(editedImage);
    setEditedPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [editedImage]);

  if (!post.mentorId || !post.mentorId.userId) {
    return null;
  }

  const author = post.mentorId.userId;
  const isOwnPost = author._id === currentUserId;

  async function handleSaveEdit() {
    setError(null);

    try {
      const updates = { content: editedContent };

      if (editedImage) {
        const uploadResult = await uploadImage(token, editedImage);
        updates.imageUrl = uploadResult.url;
      } else if (imageRemoved) {
        updates.imageUrl = null;
      }

      await onEditPost(post._id, updates);

      setIsEditingPost(false);
      setEditedImage(null);
      setImageRemoved(false);
    } catch (err) {
      if (err.status) {
        setError(err.message);
      } else {
        setError("Não foi possível guardar a edição. Tenta novamente.");
      }
    }
  }

  function handleCancelEdit() {
    setError(null);
    setEditedContent(post.content);
    setEditedImage(null);
    setImageRemoved(false);
    setIsEditingPost(false);
  }

  function handleConfirmDelete() {
    onDeletePost(post._id);
    setShowDeleteConfirm(false);
  }

  async function handleToggleLikeComment(commentId) {
    setError(null);

    try {
      await likeComment(token, commentId);
      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== commentId) return c;
          const wasLiked = c.likedBy.includes(currentUserId);
          const newLikedBy = wasLiked
            ? c.likedBy.filter((id) => id !== currentUserId)
            : [...c.likedBy, currentUserId];
          return { ...c, likedBy: newLikedBy };
        }),
      );
    } catch {
      setError("Não foi possível registar o gosto. Tenta novamente.");
    }
  }

  async function handleReportComment(commentId) {
    setError(null);

    try {
      await reportComment(token, commentId);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, reported: true } : c)),
      );
    } catch {
      setError("Não foi possível denunciar o comentário. Tenta novamente.");
    }
  }

  async function handleDeleteComment(commentId) {
    setError(null);

    try {
      await deleteComment(token, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentsCount((prev) => prev - 1);
    } catch {
      setError("Não foi possível apagar o comentário. Tenta novamente.");
    }
  }

  async function handleEditComment(commentId, newText) {
    setError(null);

    try {
      const updated = await editComment(token, commentId, newText);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c)),
      );
    } catch {
      setError("Não foi possível guardar o comentário. Tenta novamente.");
    }
  }

  async function handleAddComment(postId, text) {
    setError(null);

    try {
      const newComment = await createComment(token, postId, text);
      setComments((prev) => [...prev, newComment]);
      setCommentsCount((prev) => prev + 1);
    } catch {
      setError("Não foi possível publicar o comentário. Tenta novamente.");
    }
  }

  return (
    <article className="post-card">
      <header className="post-card_header">
        <Link to={`/mentores/${author._id}`} className="post-card_author">
          <Avatar
            src={author.avatarUrl}
            name={author.name}
            surname={author.surname}
          />
          <span>
            {author.name} {author.surname}
            {post.mentorId.isVerified && (
              <FaCheckCircle
                className="post-card_verified"
                title="Mentor verificado"
              />
            )}
          </span>
        </Link>
        <time>
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: pt,
          })}
        </time>

        {isOwnPost && (
          <div className="post-card_menu-wrapper">
            <button
              type="button"
              className="post-card_menu-trigger"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Opções do post"
            >
              <FiMoreVertical />
            </button>

            {showMenu && (
              <div className="post-card_menu-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPost(true);
                    setShowMenu(false);
                  }}
                >
                  <FaPen /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                >
                  <FaTrash /> Apagar
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {isEditingPost ? (
        <div className="post-card_edit">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            ref={editFileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              setEditedImage(e.target.files[0]);
              setImageRemoved(false);
            }}
          />

          {editedPreviewUrl ? (
            <div className="post-card_edit-image-preview">
              <img src={editedPreviewUrl} alt="Pré-visualização" />
              <button
                type="button"
                onClick={() => setEditedImage(null)}
                aria-label="Remover nova imagem"
              >
                <FiX />
              </button>
            </div>
          ) : (
            post.imageUrl &&
            !imageRemoved && (
              <div className="post-card_edit-image-preview">
                <img src={post.imageUrl} alt="" />
                <button
                  type="button"
                  onClick={() => setImageRemoved(true)}
                  aria-label="Remover imagem"
                >
                  <FiX />
                </button>
              </div>
            )
          )}

          <button
            type="button"
            className="post-card_edit-image-btn"
            onClick={() => editFileInputRef.current.click()}
          >
            <FiImage />{" "}
            {post.imageUrl || editedPreviewUrl
              ? "Trocar imagem"
              : "Adicionar imagem"}
          </button>

          <div className="post-card_edit-actions">
            <button onClick={handleSaveEdit} aria-label="Guardar">
              <FiCheck />
            </button>
            <button onClick={handleCancelEdit} aria-label="Cancelar">
              <FiX />
            </button>
          </div>
        </div>
      ) : (
        <div className="post-card_content">
          <p>{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt=""
              onClick={() => setIsImageOpen(true)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      )}

      {isImageOpen && (
        <div
          className="post-card_lightbox-overlay"
          onClick={() => setIsImageOpen(false)}
        >
          <button
            type="button"
            className="post-card_lightbox-close"
            onClick={() => setIsImageOpen(false)}
            aria-label="Fechar"
          >
            <FiX />
          </button>
          <img
            src={post.imageUrl}
            alt=""
            className="post-card_lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="post-card_actions">
        <button onClick={() => onToggleLike(post._id)}>
          {post.likedBy.includes(currentUserId) ? <FaHeart /> : <FaRegHeart />}{" "}
          {post.likedBy.length}
        </button>
        <button onClick={() => setShowComments((prev) => !prev)}>
          <FiMessageSquare /> {commentsCount}
        </button>

        <button
          className="post-card_report-btn"
          onClick={() => onReportPost(post._id)}
          disabled={post.reported}
        >
          <FiFlag /> {post.reported ? "Denunciado" : "Denunciar"}
        </button>
      </div>

      {error && <p className="post-card_error">{error}</p>}

      {showComments && (
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
          onAdd={handleAddComment}
          onReport={handleReportComment}
          onToggleLike={handleToggleLikeComment}
          postId={post._id}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Apagar este post?"
          message="Esta ação não pode ser desfeita."
          confirmLabel="Sim, apagar"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </article>
  );
}
