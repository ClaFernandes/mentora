import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import CommentList from "./CommentList";
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiFlag } from "react-icons/fi";
import { findAuthorById } from "../../utils/authorHelpers";
import "./PostCard.css";

export default function PostCard({
    post,
    currentUserId,
    onToggleLike,
    onReportPost,
    comments,
    onEditComment,
    onDeleteComment,
    onAddComment,
    onReportComment,
    onToggleLikeComment,
}) {
    const [showComments, setShowComments] = useState(false);

    const author = findAuthorById(post.authorId);
    if (!author) return null;

    const isLiked = post.likedBy.includes(currentUserId);
    const likesCount = post.likedBy.length;
    const commentsForPost = comments.filter((c) => c.postId === post.id);
    const commentsCount = commentsForPost.length;

    return (
        <article className="post-card">
            <header className="post-card_header">
                <Link to={`/mentores/${author.id}`} className="post-card_author">
                    <Avatar src={author.avatarUrl} name={author.name} />
                    <span>{author.name}</span>
                </Link>
                <time>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: pt })}
                </time>
            </header>

            <div className="post-card_content">
                <p>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="" />}
            </div>

            <div className="post-card_actions">
                <button onClick={() => onToggleLike(post.id)}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />} {likesCount}
                </button>
                <button onClick={() => setShowComments((prev) => !prev)}>
                    {commentsCount} comentários
                </button>

                <button
                    className="post-card_report-btn"
                    onClick={() => onReportPost(post.id)}
                    disabled={post.reported}
                >
                    <FiFlag /> {post.reported ? "Denunciado" : "Denunciar"}
                </button>
            </div>

            {showComments && (
                <CommentList
                    comments={commentsForPost}
                    currentUserId={currentUserId}
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                    onAdd={onAddComment}
                    onReport={onReportComment}
                    onToggleLike={onToggleLikeComment}
                    postId={post.id}
                />
            )}
        </article>
    );
}