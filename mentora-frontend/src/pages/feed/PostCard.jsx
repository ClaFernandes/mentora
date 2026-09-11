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
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { FaHeart, FaRegHeart, FaPen, FaTrash } from "react-icons/fa";
import { FiFlag, FiMoreVertical, FiCheck, FiX, FiImage } from "react-icons/fi";
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
    const [showMenu, setShowMenu] = useState(false);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editedImage, setEditedImage] = useState(null);
    const [editedPreviewUrl, setEditedPreviewUrl] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);

    const editFileInputRef = useRef(null);

    const author = post.mentorId.userId;
    const isOwnPost = author._id === currentUserId;

    useEffect(() => {
        if (showComments && !commentsLoaded) {
            getComments(token, post._id).then((data) => {
                setComments(data);
                setCommentsLoaded(true);
            });
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

    async function handleSaveEdit() {
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
    }

    function handleCancelEdit() {
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
        await likeComment(token, commentId);

        setComments((prev) =>
            prev.map((c) => {
                if (c._id !== commentId) return c;
                const wasLiked = c.likedBy.includes(currentUserId);
                const newLikedBy = wasLiked
                    ? c.likedBy.filter((id) => id !== currentUserId)
                    : [...c.likedBy, currentUserId];
                return { ...c, likedBy: newLikedBy };
            })
        );
    }

    async function handleReportComment(commentId) {
        await reportComment(token, commentId);
        setComments((prev) =>
            prev.map((c) => (c._id === commentId ? { ...c, reported: true } : c))
        );
    }

    async function handleDeleteComment(commentId) {
        await deleteComment(token, commentId);
        setComments((prev) => prev.filter((c) => c._id !== commentId));
    }

    async function handleEditComment(commentId, newText) {
        const updated = await editComment(token, commentId, newText);
        setComments((prev) =>
            prev.map((c) => (c._id === commentId ? updated : c))
        );
    }

    async function handleAddComment(postId, text) {
        const newComment = await createComment(token, postId, text);
        setComments((prev) => [...prev, newComment]);
    }

    return (
        <article className="post-card">
            <header className="post-card_header">
                <Link to={`/mentores/${author._id}`} className="post-card_author">
                    <Avatar src={author.avatarUrl} name={author.name} />
                    <span>{author.name}</span>
                </Link>
                <time>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: pt })}
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
                        post.imageUrl && !imageRemoved && (
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
                        <FiImage /> {post.imageUrl || editedPreviewUrl ? "Trocar imagem" : "Adicionar imagem"}
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
                    {post.imageUrl && <img src={post.imageUrl} alt="" />}
                </div>
            )}

            <div className="post-card_actions">
                <button onClick={() => onToggleLike(post._id)}>
                    {post.likedBy.includes(currentUserId) ? <FaHeart /> : <FaRegHeart />} {post.likedBy.length}
                </button>
                <button onClick={() => setShowComments((prev) => !prev)}>
                    Comentários
                </button>

                <button
                    className="post-card_report-btn"
                    onClick={() => onReportPost(post._id)}
                    disabled={post.reported}
                >
                    <FiFlag /> {post.reported ? "Denunciado" : "Denunciar"}
                </button>
            </div>

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