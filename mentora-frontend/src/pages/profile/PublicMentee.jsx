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

  useEffect(() => {
    const followingIds = mentee.followingMentors || [];

    if (followingIds.length === 0) {
      setFollowedMentors([]);
      return;
    }

    Promise.all(followingIds.map((id) => getMentorProfile(id))).then(
      setFollowedMentors,
    );
  }, [mentee.followingMentors]);

  return (
    <div className="mentee-profile">
      <header className="mentee-profile_header">
        <Avatar src={mentee.avatarUrl} name={mentee.name} surname={mentee.surname} size={80} />
        <div className="mentee-profile_header-info">
          <h2>{mentee.name} {mentee.surname}</h2>
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
        <div className="mentors-grid">
          {followedMentors.length === 0 ? (
            <p className="mentee-profile_followed-empty">
              Ainda não segue nenhum mentor.
            </p>
          ) : (
            followedMentors.map((mentor) => (
              <Link
                key={mentor._id}
                to={`/mentores/${mentor.userId._id}`}
                className="mentors-card"
              >
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
    </div>
  );
}
