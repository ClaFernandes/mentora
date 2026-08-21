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
                {sortedPosts.length === 0 ? (
                    <EmptyState message="Ainda não há publicações." />
                ) : (
                    visiblePosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={user.id}
                            onToggleLike={handleToggleLike}
                            comments={comments}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                            onAddComment={handleAddComment}
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