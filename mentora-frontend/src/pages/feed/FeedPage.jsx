import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { getFeed, likePost, reportPost, editPost, deletePost } from "../../services/feedService.js";
import PostForm from "./PostForm.jsx";
import PostCard from "./PostCard";
import EmptyState from "../../components/EmptyState";
import "./FeedPage.css";

const PAGE_SIZE = 4;

export default function FeedPage() {
    const { user, token } = useAuth();

    const [posts, setPosts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [reportNotice, setReportNotice] = useState(null);
    const [error, setError] = useState(null);

    const hasLoadedRef = useRef(false);

    async function loadFeed() {
        setLoading(true);
        setError(null);

        try {
            const result = await getFeed(token, cursor, PAGE_SIZE);

            setPosts((prev) => [...prev, ...result.posts]);
            setCursor(result.nextCursor);
            setHasMore(result.posts.length === PAGE_SIZE);
        } catch {
            setError("Não foi possível carregar o feed. Tenta novamente.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;
        loadFeed();
    }, []);

    function showReportNotice(message) {
        setReportNotice(message);
        setTimeout(() => setReportNotice(null), 3000);
    }

    function handlePostCreated(newPost) {
        setPosts((prev) => [newPost, ...prev]);
    }

    async function handleToggleLike(postId) {
        const post = posts.find((p) => p._id === postId);
        const wasLiked = post.likedBy.includes(user.id);

        setError(null);

        try {
            await likePost(token, postId);

            setPosts((prev) =>
                prev.map((p) => {
                    if (p._id !== postId) return p;

                    const newLikedBy = wasLiked
                        ? p.likedBy.filter((id) => id !== user.id)
                        : [...p.likedBy, user.id];

                    return { ...p, likedBy: newLikedBy };
                })
            );
        } catch {
            setError("Não foi possível registar o gosto. Tenta novamente.");
        }
    }

    async function handleReportPost(postId) {
        setError(null);

        try {
            await reportPost(token, postId);

            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId ? { ...post, reported: true } : post
                )
            );
            showReportNotice("Post denunciado. A nossa equipa vai rever.");
        } catch {
            setError("Não foi possível denunciar o post. Tenta novamente.");
        }
    }

    async function handleEditPost(postId, updates) {
        setError(null);

        try {
            const updated = await editPost(token, postId, updates);

            setPosts((prev) =>
                prev.map((post) => (post._id === postId ? updated : post))
            );
        } catch {
            setError("Não foi possível guardar a edição. Tenta novamente.");
        }
    }

    async function handleDeletePost(postId) {
        setError(null);

        try {
            await deletePost(token, postId);

            setPosts((prev) => prev.filter((post) => post._id !== postId));
        } catch {
            setError("Não foi possível apagar o post. Tenta novamente.");
        }
    }

    return (
        <div className="container">
            <div className="feed">
                {user.role === "mentor" && (
                    <PostForm onPostCreated={handlePostCreated} />
                )}

                {reportNotice && <div className="feed_notice">{reportNotice}</div>}

                {error && <div className="feed_notice">{error}</div>}

                {posts.length === 0 ? (
                    !error && <EmptyState message="Ainda não há publicações." />
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUserId={user.id}
                            onToggleLike={handleToggleLike}
                            onReportPost={handleReportPost}
                            onEditPost={handleEditPost}
                            onDeletePost={handleDeletePost}
                        />
                    ))
                )}

                {hasMore && (
                    <button
                        type="button"
                        className="feed_load-more"
                        onClick={loadFeed}
                        disabled={loading}
                    >
                        {loading ? "A carregar..." : "Carregar mais"}
                    </button>
                )}
            </div>
        </div>
    )
}