import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getPostById, likePost, reportPost, editPost, deletePost } from "../../services/feedService.js";
import PostCard from "./PostCard";
import "./FeedPage.css";

export default function PostPage() {
    const { id } = useParams();
    const { user, token } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [reportNotice, setReportNotice] = useState(null);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);

        getPostById(token, id)
            .then(setPost)
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id, token]);

    function showReportNotice(message) {
        setReportNotice(message);
        setTimeout(() => setReportNotice(null), 3000);
    }

    async function handleToggleLike() {
        const wasLiked = post.likedBy.includes(user.id);

        await likePost(token, post._id);

        setPost((prev) => {
            const newLikedBy = wasLiked
                ? prev.likedBy.filter((likeId) => likeId !== user.id)
                : [...prev.likedBy, user.id];

            return { ...prev, likedBy: newLikedBy };
        });
    }

    async function handleReportPost() {
        await reportPost(token, post._id);
        setPost((prev) => ({ ...prev, reported: true }));
        showReportNotice("Post denunciado. A nossa equipa vai rever.");
    }

    async function handleEditPost(postId, updates) {
        const updated = await editPost(token, postId, updates);
        setPost(updated);
    }

    async function handleDeletePost() {
        await deletePost(token, post._id);
        setPost(null);
        setNotFound(true);
    }

    if (loading) return null;

    if (notFound || !post) {
        return <p>Post não encontrado.</p>;
    }

    return (
        <div className="container">
            <div className="feed">
                {reportNotice && <div className="feed_notice">{reportNotice}</div>}

                <PostCard
                    post={post}
                    currentUserId={user.id}
                    onToggleLike={handleToggleLike}
                    onReportPost={handleReportPost}
                    onEditPost={handleEditPost}
                    onDeletePost={handleDeletePost}
                />
            </div>
        </div>
    );
}