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
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  async function loadPosts() {
    setLoading(true);

    const result = await getPostsByMentor(mentorId, cursor, PAGE_SIZE);

    setPosts((prev) => [...prev, ...result.posts]);
    setCursor(result.nextCursor);
    setHasMore(result.posts.length === PAGE_SIZE);
    setLoading(false);
  }

  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setInitialLoadDone(false);
  }, [mentorId]);

  useEffect(() => {
    if (initialLoadDone) return;
    setInitialLoadDone(true);
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoadDone]);

  async function handleToggleLike(postId) {
    const post = posts.find((p) => p._id === postId);
    const wasLiked = post.likedBy.includes(user.id);

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
  }

  async function handleReportPost(postId) {
    await reportPost(token, postId);
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, reported: true } : post,
      ),
    );
  }

  async function handleEditPost(postId, updates) {
    const updated = await editPost(token, postId, updates);
    setPosts((prev) =>
      prev.map((post) => (post._id === postId ? updated : post)),
    );
  }

  async function handleDeletePost(postId) {
    await deletePost(token, postId);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  }

  return (
    <section className="mentor-posts-section">
      <h3>Publicações</h3>

      {posts.length === 0 && !loading ? (
        <EmptyState message="Ainda não há publicações." />
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
          onClick={loadPosts}
          disabled={loading}
        >
          {loading ? "A carregar..." : "Ver mais publicações"}
        </button>
      )}
    </section>
  );
}
