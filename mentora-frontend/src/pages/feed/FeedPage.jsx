import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import PostCard from "./PostCard";
import EmptyState from "../../components/EmptyState";
import { MOCK_POSTS, MOCK_COMMENTS } from "../../mocks/mockData";
import "./FeedPage.css";

const PAGE_SIZE = 4;

export default function FeedPage() {
    const { user } = useAuth();

    const [posts, setPosts] = useState(MOCK_POSTS);
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [reportNotice, setReportNotice] = useState(null);

    function showReportNotice(message) {
        setReportNotice(message);
        setTimeout(() => setReportNotice(null), 3000);
    }

    function handleToggleLike(postId) {
        setPosts((prev) =>
            prev.map((post) => {
                if (post.id !== postId) return post;

                const alreadyLiked = post.likedBy.includes(user.id);
                const newLikedBy = alreadyLiked
                    ? post.likedBy.filter((id) => id !== user.id)
                    : [...post.likedBy, user.id];

                return { ...post, likedBy: newLikedBy };
            })
        );
    }

    function handleReportPost(postId) {
        setPosts((prev) =>
            prev.map((post) => (post.id === postId ? { ...post, reported: true } : post))
        );
        showReportNotice("Post denunciado. A nossa equipa vai rever.");
    }

    function handleReportComment(commentId) {
        setComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, reported: true } : c))
        );
        showReportNotice("Comentário denunciado. A nossa equipa vai rever.");
    }

    function handleToggleLikeComment(commentId) {
        setComments((prev) =>
            prev.map((comment) => {
                if (comment.id !== commentId) return comment;

                const likedBy = comment.likedBy || [];
                const alreadyLiked = likedBy.includes(user.id);
                const newLikedBy = alreadyLiked
                    ? likedBy.filter((id) => id !== user.id)
                    : [...likedBy, user.id];

                return { ...comment, likedBy: newLikedBy };
            })
        );
    }

    function handleDeleteComment(commentId) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

    function handleEditComment(commentId, newText) {
        setComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, text: newText } : c))
        );
    }

    function handleAddComment(postId, text) {
        const newComment = {
            id: `c${Date.now()}`,
            postId,
            authorId: user.id,
            text,
            createdAt: new Date().toISOString(),
        };
        setComments((prev) => [...prev, newComment]);
    }

    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const visiblePosts = sortedPosts.slice(0, visibleCount);
    const hasMore = visibleCount < sortedPosts.length;

    return (
        <div className="container">
            <div className="feed">
                {reportNotice && <div className="feed_notice">{reportNotice}</div>}

                {sortedPosts.length === 0 ? (
                    <EmptyState message="Ainda não há publicações." />
                ) : (
                    visiblePosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={user.id}
                            onToggleLike={handleToggleLike}
                            onReportPost={handleReportPost}
                            comments={comments}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                            onAddComment={handleAddComment}
                            onReportComment={handleReportComment}
                            onToggleLikeComment={handleToggleLikeComment}
                        />
                    ))
                )}

                {hasMore && (
                    <button
                        type="button"
                        className="feed_load-more"
                        onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    >
                        Carregar mais
                    </button>
                )}
            </div>
        </div>
    )
}