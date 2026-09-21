import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getAvailability,
  createAvailability,
  deleteAvailability,
} from "../../services/availabilityService.js";
import ProfileAvatarUpload from "../../components/ProfileAvatarUpload.jsx";
import DangerZoneSection from "../../components/DangerZoneSection.jsx";
import AvailabilityCalendar from "../../components/AvailabilityCalendar.jsx";
import MentorBioSection from "./MentorBioSection.jsx";
import MentorAreasSection from "./MentorAreasSection.jsx";
import MentorOfferingsSection from "./MentorOfferingsSection.jsx";
import MentorPostsSection from "./MentorPostsSection.jsx";
import { FaCheckCircle } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import "./MentorProfile.css";

export default function OwnProfileMentor({ mentor }) {
  const { token } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [availabilityError, setAvailabilityError] = useState(null);

  useEffect(() => {
    getAvailability(mentor.id)
      .then(setAvailability)
      .catch(() =>
        setAvailabilityError("Não foi possível carregar a disponibilidade. Tenta novamente."),
      );
  }, [mentor.id]);

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

      <section className="mentor-profile_meta mentor-profile_meta-readonly">
        <div className="mentor-profile_stats">
          <p className="mentor-profile_rating">
            <AiFillStar /> {mentor.mentorProfile.avgRating}
          </p>
          <p className="mentor-profile_followers">
            {mentor.mentorProfile.followersCount} seguidores
          </p>
        </div>
      </section>

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

      <DangerZoneSection variant="mentor" />
    </div>
  );
}
