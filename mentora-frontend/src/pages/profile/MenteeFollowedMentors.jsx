import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getMentorProfile } from "../../services/mentorService.js";
import { unfollowMentor } from "../../services/followService.js";
import Avatar from "../../components/Avatar.jsx";
import { AiFillStar } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import "../mentors/MentorsPage.css";

export default function MenteeFollowedMentors({ followingMentors }) {
    const { token, setUser } = useAuth();
    const [followedMentors, setFollowedMentors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const followingIds = followingMentors || [];
        if (followingIds.length === 0) {
            setFollowedMentors([]);
            return;
        }

        Promise.allSettled(followingIds.map((id) => getMentorProfile(id))).then(
            (results) => {
                const loaded = results
                    .filter((r) => r.status === "fulfilled")
                    .map((r) => r.value);

                setFollowedMentors(loaded);

                if (loaded.length === 0) {
                    setError("Não foi possível carregar os mentores que segues. Tenta novamente.");
                } else {
                    setError(null);
                }
            },
        );
    }, [followingMentors]);

    async function unfollow(mentorId) {
        setError(null);

        try {
            await unfollowMentor(token, mentorId);

            setUser((prev) => ({
                ...prev,
                menteeProfile: {
                    ...prev.menteeProfile,
                    followingMentors: prev.menteeProfile.followingMentors.filter((id) => id !== mentorId),
                },
            }));
        } catch {
            setError("Não foi possível deixar de seguir. Tenta novamente.");
        }
    }

    return (
        <section className="mentee-profile_followed">
            <h3>Mentores seguidos</h3>

            {error && <p className="mentee-profile_error">{error}</p>}

            <div className="mentors-grid">
                {followedMentors.length === 0 ? (
                    !error && (
                        <p className="mentee-profile_followed-empty">
                            Ainda não segues nenhum mentor.
                        </p>
                    )
                ) : (
                    followedMentors.map((mentor) => (
                        <Link
                            key={mentor._id}
                            to={`/mentores/${mentor.userId._id}`}
                            className="mentors-card"
                        >
                            <button
                                type="button"
                                className="mentee-profile_unfollow-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    unfollow(mentor.userId._id);
                                }}
                                aria-label="Deixar de seguir"
                            >
                                <FiX />
                            </button>
                            <Avatar src={mentor.userId.avatarUrl} name={mentor.userId.name} surname={mentor.userId.surname} size={64} />
                            <h3>{mentor.userId.name} {mentor.userId.surname}</h3>
                            <p className="mentors-card-offering">
                                {mentor.offerings[0]?.title}
                            </p>
                            <p className="mentors-card-rating">
                                <AiFillStar /> {mentor.avgRating}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}