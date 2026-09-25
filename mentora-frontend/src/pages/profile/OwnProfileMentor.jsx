import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getAvailability,
  createAvailability,
  deleteAvailability,
} from "../../services/availabilityService.js";
import { getMyFollowers, removeFollower } from "../../services/mentorService.js";
import ProfileAvatarUpload from "../../components/ProfileAvatarUpload.jsx";
import ChangePasswordSection from "../../components/ChangePasswordSection.jsx";
import DangerZoneSection from "../../components/DangerZoneSection.jsx";
import AvailabilityCalendar from "../../components/AvailabilityCalendar.jsx";
import MentorBioSection from "./MentorBioSection.jsx";
import MentorAreasSection from "./MentorAreasSection.jsx";
import MentorOfferingsSection from "./MentorOfferingsSection.jsx";
import MentorPostsSection from "./MentorPostsSection.jsx";
import FollowersModal from "../../components/FollowersModal.jsx";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import "./MentorProfile.css";

export default function OwnProfileMentor({ mentor }) {
  const { token } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  useEffect(() => {
    getAvailability(mentor.id)
      .then(setAvailability)
      .catch(() =>
        setAvailabilityError("Não foi possível carregar a disponibilidade. Tenta novamente."),
      );
  }, [mentor.id]);

  useEffect(() => {
    getMyFollowers(token)
      .then(setFollowers)
      .catch(() => { });
  }, [token, mentor.id]);

  async function handleAddAvailabilityBlock(blockData) {
    setAvailabilityError(null);

    try {
      const createdBlock = await createAvailability(token, blockData);
      setAvailability((prev) => [...prev, createdBlock]);
    } catch {
      setAvailabilityError("Não foi possível adicionar o horário. Tenta novamente.");
    }
  }

  async function handleRemoveAvailabilityBlock(availabilityId) {
    setAvailabilityError(null);

    try {
      await deleteAvailability(token, availabilityId);
      setAvailability((prev) =>
        prev.filter((block) => block._id !== availabilityId),
      );
    } catch {
      setAvailabilityError("Não foi possível remover o horário. Tenta novamente.");
    }
  }

  async function handleRemoveFollower(followerId) {
    try {
      await removeFollower(token, followerId);
      setFollowers((prev) => (prev || []).filter((f) => f._id !== followerId));
    } catch {
    }
  }

  return (
    <div className="mentor-profile">
      <header className="mentor-profile_header">
        <ProfileAvatarUpload
          name={mentor.name}
          surname={mentor.surname}
          avatarUrl={mentor.avatarUrl}
          variant="mentor"
        />

        <div className="mentor-profile_header-info">
          <h2>
            {mentor.name} {mentor.surname}
            {mentor.mentorProfile.isVerified && (
              <FaCheckCircle
                className="mentor-profile_verified"
                title="Mentor verificado"
              />
            )}
          </h2>
        </div>
      </header>

      <section className="mentor-profile_meta">
        <p className="mentor-profile_rating">
          <AiFillStar /> {mentor.mentorProfile.avgRating}
        </p>
        <button
          type="button"
          className="mentor-profile_followers-btn"
          onClick={() => setShowFollowersModal(true)}
        >
          {(() => {
            const count = followers ? followers.length : mentor.mentorProfile.followersCount;
            return `${count} ${count === 1 ? "seguidor" : "seguidores"}`;
          })()}
        </button>
      </section>

      {showFollowersModal && (
        <FollowersModal
          followers={followers || []}
          onClose={() => setShowFollowersModal(false)}
          onRemove={handleRemoveFollower}
        />
      )}

      <MentorBioSection bio={mentor.bio} />

      <MentorAreasSection areas={mentor.mentorProfile.areas} />

      <MentorOfferingsSection offerings={mentor.mentorProfile.offerings} />

      <section className="mentor-profile_availability">
        <h3>Disponibilidade</h3>

        {availabilityError && (
          <p className="mentor-profile_error">{availabilityError}</p>
        )}

        <AvailabilityCalendar
          availability={availability}
          onAddBlock={handleAddAvailabilityBlock}
          onRemoveBlock={handleRemoveAvailabilityBlock}
        />
      </section>

      <MentorPostsSection mentorId={mentor.id} />

      <ChangePasswordSection variant="mentor" />

      <DangerZoneSection variant="mentor" />
    </div>
  );
}