import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getPostsByMentor,
  likePost,
  reportPost,
  editPost,
  deletePost,
} from "../../services/feedService.js";
import PostCard from "../feed/PostCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import "./MentorPostsSection.css";

const PAGE_SIZE = 3;

export default function MentorPostsSection({ mentorId }) {
  const { user, token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
    setLoading(true);

    getPostsByMentor(mentorId, null, PAGE_SIZE)
      .then((result) => {
        if (cancelled) return;
        setPosts(result.posts);
        setCursor(result.nextCursor);
        setHasMore(result.posts.length === PAGE_SIZE);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Não foi possível carregar as publicações. Tenta novamente.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mentorId]);

  async function loadMorePosts() {
    setLoading(true);
    setError(null);

    try {
      const result = await getPostsByMentor(mentorId, cursor, PAGE_SIZE);

      setPosts((prev) => [...prev, ...result.posts]);
      setCursor(result.nextCursor);
      setHasMore(result.posts.length === PAGE_SIZE);
    } catch {
      setError("Não foi possível carregar mais publicações. Tenta novamente.");
    } finally {
      setLoading(false);
    }
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
        }),
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
          post._id === postId ? { ...post, reported: true } : post,
        ),
      );
    } catch {
      setError("Não foi possível denunciar o post. Tenta novamente.");
    }
  }

  async function handleEditPost(postId, updates) {
    setError(null);

    try {
      const updated = await editPost(token, postId, updates);
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updated : post)),
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
    <section className="mentor-posts-section">
      <h3>Publicações</h3>

      {error && <p className="mentor-posts-section_error">{error}</p>}

      {posts.length === 0 && !loading ? (
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

      {hasMore && posts.length > 0 && (
        <button
          type="button"
          className="mentor-posts-section_load-more"
          onClick={loadMorePosts}
          disabled={loading}
        >
          {loading ? "A carregar..." : "Ver mais publicações"}
        </button>
      )}
    </section>
  );
}