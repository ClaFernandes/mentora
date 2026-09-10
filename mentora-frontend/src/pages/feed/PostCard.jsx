import { useState, useEffect } from "react";
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
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { FaHeart, FaRegHeart, FaPen, FaTrash } from "react-icons/fa";
import { FiFlag, FiMoreVertical, FiCheck, FiX } from "react-icons/fi";
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

    function handleSaveEdit() {
        onEditPost(post._id, editedContent);
        setIsEditingPost(false);
    }

    function handleCancelEdit() {
        setEditedContent(post.content);
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