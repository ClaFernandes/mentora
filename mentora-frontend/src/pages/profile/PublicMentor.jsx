import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import MentorPostsSection from "./MentorPostsSection.jsx";
import { followMentor, unfollowMentor } from "../../services/followService.js";
import { FaCheckCircle } from "react-icons/fa";
import { FiCheck, FiPlus, FiMessageCircle } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import "./MentorProfile.css";

export default function PublicMentor({ mentor }) {
  const navigate = useNavigate();
  const { user, updateUser, token } = useAuth();

  const isFollowing = user.menteeProfile?.followingMentors?.includes(
    mentor.userId._id,
  );

  async function toggleFollow() {
    const following = user.menteeProfile?.followingMentors || [];

    if (isFollowing) {
      await unfollowMentor(token, mentor.userId._id);
    } else {
      await followMentor(token, mentor.userId._id);
    }

    const updated = isFollowing
      ? following.filter((id) => id !== mentor.userId._id)
      : [...following, mentor.userId._id];

    updateUser({
      menteeProfile: { ...user.menteeProfile, followingMentors: updated },
    });
  }

  function handleSendMessage(offering) {
    navigate("/chat", {
      state: {
        offeringId: offering._id,
        offeringTitle: offering.title,
        otherUser: mentor.userId,
      },
    });
  }

  function handleSchedule(offeringId) {
    navigate(`/agendar/${mentor.userId._id}`, { state: { offeringId } });
  }

  return (
    <div className="mentor-profile">
      <header className="mentor-profile_header">
        <Avatar
          src={mentor.userId.avatarUrl}
          name={mentor.userId.name}
          surname={mentor.userId.surname}
          size={80}
        />
        <div className="mentor-profile_header-info">
          <h2>
            {mentor.userId.name} {mentor.userId.surname}
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
        </div>
      </section>

      <section className="mentor-profile_offerings">
        <h3>Ofertas</h3>

        {mentor.offerings.map((offering) => (
          <div key={offering._id} className="mentor-profile_offering">
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

              <div className="mentor-profile_offering-actions-mentee">
                <button
                  type="button"
                  className="mentor-profile_offering-message-btn"
                  onClick={() => handleSendMessage(offering)}
                >
                  <FiMessageCircle /> Mensagem
                </button>

                {user.role === "mentee" && (
                  <button
                    type="button"
                    className="mentor-profile_offering-schedule-btn"
                    onClick={() => handleSchedule(offering._id)}
                  >
                    Agendar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <MentorPostsSection mentorId={mentor.userId._id} />
    </div>
  );
}
