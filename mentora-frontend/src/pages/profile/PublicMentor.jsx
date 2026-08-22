import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import { FaCheckCircle } from "react-icons/fa";
import { FiCheck, FiPlus } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import "./MentorProfile.css";

export default function PublicMentor({ mentor }) {
  const { user, updateUser } = useAuth();

  const isFollowing = user.menteeProfile?.followingMentors?.includes(mentor.id);

  function toggleFollow() {
    const following = user.menteeProfile?.followingMentors || [];
    const updated = isFollowing
      ? following.filter((id) => id !== mentor.id)
      : [...following, mentor.id];
    updateUser({
      menteeProfile: { ...user.menteeProfile, followingMentors: updated },
    });
  }

  return (
    <div className="mentor-profile">
      <header className="mentor-profile_header">
        <Avatar src={mentor.avatarUrl} name={mentor.name} size={80} />
        <div className="mentor-profile_header-info">
          <h2>
            {mentor.name}
            {mentor.isVerified && (
              <FaCheckCircle
                className="mentor-profile_verified"
                title="Mentor verificado"
              />
            )}
          </h2>
        </div>
      </header>

      <section className="mentor-profile_bio">
        <p>{mentor.bio}</p>
      </section>

      <section className="mentor-profile_areas">
        <div className="mentor-profile_areas-badges">
          {[...new Set(mentor.offerings.map((o) => o.area))].map((area) => (
            <span key={area} className="mentor-profile_area-badge">
              {area}
            </span>
          ))}
        </div>
      </section>

      <section className="mentor-profile_meta">
        <div className="mentor-profile_stats">
          <p className="mentor-profile_rating">
            <AiFillStar /> {mentor.avgRating}
          </p>
          <p className="mentor-profile_followers">
            {mentor.followersCount} seguidores
          </p>
        </div>

        <div className="mentor-profile_actions">
          {user.role === "mentee" && (
            <button
              type="button"
              onClick={toggleFollow}
              className="mentor-profile_follow-btn"
            >
              {isFollowing ? <FiCheck /> : <FiPlus />}
              {isFollowing ? "A seguir" : "Seguir"}
            </button>
          )}
          <button
            type="button"
            className="mentor-profile_schedule-btn"
            disabled
          >
            Agendar
          </button>
        </div>
      </section>

      <section className="mentor-profile_offerings">
        <h3>Ofertas</h3>

        {mentor.offerings.map((offering) => (
          <div key={offering.id} className="mentor-profile_offering">
            <div className="mentor-profile_offering-view">
              <div className="mentor-profile_offering-info">
                <h4>{offering.title}</h4>
                <span className="mentor-profile_offering-area">
                  {offering.area}
                </span>
                <span className="mentor-profile_offering-price">
                  {offering.sessionPrice}€
                </span>
                <p>{offering.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
