import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "./RatingStars.css";

export default function RatingStars({
    mode,
    rating,
    reviewText,
    onSubmit,
    onCancel,
}) {
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewDraft, setReviewDraft] = useState("");

    if (mode === "read") {
        return (
            <div className="rating-stars rating-stars--read">
                <div className="rating-stars_row">
                    {[1, 2, 3, 4, 5].map((star) =>
                        star <= rating ? (
                            <AiFillStar key={star} className="rating-star rating-star--filled" />
                        ) : (
                            <AiOutlineStar key={star} className="rating-star" />
                        )
                    )}
                </div>
                {reviewText && <p className="rating-review-text">"{reviewText}"</p>}
            </div>
        );
    }

    const displayRating = hoveredRating || selectedRating;

    function handleSubmit() {
        if (selectedRating === 0) {
            return;
        }
        onSubmit({ rating: selectedRating, reviewText: reviewDraft.trim() || null });
    }

    return (
        <div className="rating-stars rating-stars--write">
            <div className="rating-stars_row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="rating-star-btn"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        aria-label={`Dar ${star} estrela${star > 1 ? "s" : ""}`}
                    >
                        {star <= displayRating ? (
                            <AiFillStar className="rating-star rating-star--filled" />
                        ) : (
                            <AiOutlineStar className="rating-star" />
                        )}
                    </button>
                ))}
            </div>

            <textarea
                className="rating-textarea"
                placeholder="Deixa um comentário sobre a sessão (opcional)"
                value={reviewDraft}
                onChange={(e) => setReviewDraft(e.target.value)}
            />

            <div className="rating-actions">
                <button type="button" className="rating-cancel-btn" onClick={onCancel}>
                    Cancelar
                </button>
                <button
                    type="button"
                    className="rating-submit-btn"
                    onClick={handleSubmit}
                    disabled={selectedRating === 0}
                >
                    Enviar avaliação
                </button>
            </div>
        </div>
    );
}
