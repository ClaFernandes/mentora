import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { uploadImage } from "../../services/uploadService.js";
import { createPost } from "../../services/feedService.js";
import { FiImage, FiX } from "react-icons/fi";
import "./PostForm.css";

export default function PostForm({ onPostCreated }) {
  const { token } = useAuth();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    useEffect(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        const maxHeight = 220;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
        el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
      }
    }, [content]);

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  async function handleSubmit(e) {
    setError(null);

    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (image) {
        const uploadResult = await uploadImage(token, image);
        imageUrl = uploadResult.url;
      }
      const type = image ? "image" : "text";
      const newPost = await createPost(token, { content, type, imageUrl });
      onPostCreated(newPost);
      setContent("");
      setImage(null);
    } catch (err) {
      if (err.status) {
        setError(err.message);
      } else {
        setError("Não foi possível publicar. Tenta novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="post-form_textarea"
        placeholder="No que estás a pensar?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => setImage(e.target.files[0])}
      />

      {previewUrl && (
        <div className="post-form_preview">
          <img src={previewUrl} alt="Pré-visualização" />
          <button
            type="button"
            className="post-form_remove-image-btn"
            onClick={() => setImage(null)}
          >
            <FiX />
          </button>
        </div>
      )}

      {error && <p className="post-form_error">{error}</p>}

      <div className="post-form_footer">
        <button
          type="button"
          className="post-form_image-btn"
          onClick={() => fileInputRef.current.click()}
        >
          <FiImage />
        </button>

        <button
          type="submit"
          className="post-form_submit-btn"
          disabled={isSubmitting || (!content.trim() && !image)}
        >
          {isSubmitting ? "A publicar..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
