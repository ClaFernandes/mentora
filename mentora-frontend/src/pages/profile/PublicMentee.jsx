import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import { getMentorProfile } from "../../services/mentorService.js";
import { FiCheckCircle } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import "./MenteeProfile.css";
import "../mentors/MentorsPage.css";

export default function PublicMentee({ mentee }) {
  const [followedMentors, setFollowedMentors] = useState([]);
  const [error, setError] = useState(null);

  const person = mentee.userId || {};

  useEffect(() => {
    const followingIds = mentee.followingMentors || [];

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
          setError(
            "Não foi possível carregar os mentores seguidos. Tenta novamente.",
          );
        } else {
          setError(null);
        }
      },
    );
  }, [mentee.followingMentors]);

  return (
    <div className="mentee-profile">
      <header className="mentee-profile_header">
        <Avatar
          src={person.avatarUrl}
          name={person.name}
          surname={person.surname}
          size={80}
        />
        <div className="mentee-profile_header-info">
          <h2>
            {person.name} {person.surname}
          </h2>
        </div>
      </header>

      <section className="mentee-profile_bio">
        <p>{mentee.bio}</p>
      </section>

      <section className="mentee-profile_meta">
        <p className="mentee-profile_sessions">
          <FiCheckCircle /> {mentee.completedSessions} sessões concluídas
        </p>
      </section>

      <section className="mentee-profile_followed">
        <h3>Mentores seguidos</h3>
        {error && <p className="mentee-profile_error">{error}</p>}

        <div className="mentors-grid">
          {followedMentors.length === 0
            ? !error && (
                <p className="mentee-profile_followed-empty">
                  Ainda não segue nenhum mentor.
                </p>
              )
            : followedMentors.map((mentor) => (
                <Link
                  key={mentor._id}
                  to={`/mentores/${mentor.userId._id}`}
                  className="mentors-card"
                >
                  <Avatar
                    src={mentor.userId.avatarUrl}
                    name={mentor.userId.name}
                    surname={mentor.userId.surname}
                    size={64}
                  />
                  <h3>
                    {mentor.userId.name} {mentor.userId.surname}
                  </h3>
                  <p className="mentors-card-offering">
                    {mentor.offerings[0]?.title}
                  </p>
                  <p className="mentors-card-rating">
                    <AiFillStar /> {mentor.avgRating}
                  </p>
                </Link>
              ))}
        </div>
      </section>
    </div>
  );
}
