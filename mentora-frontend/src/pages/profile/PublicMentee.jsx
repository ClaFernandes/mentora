import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import { MOCK_MENTORS } from "../../mocks/mockData.js";
import { FiCheckCircle } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import "./MenteeProfile.css";
import "../mentors/MentorsPage.css";

export default function PublicMentee({ mentee }) {
  const followedMentors = MOCK_MENTORS.filter((m) =>
    mentee.followingMentors.includes(m.id),
  );

  return (
    <div className="mentee-profile">
      <header className="mentee-profile_header">
        <Avatar src={mentee.avatarUrl} name={mentee.name} size={80} />
        <div className="mentee-profile_header-info">
          <h2>{mentee.name}</h2>
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
                key={mentor.id}
                to={`/mentores/${mentor.id}`}
                className="mentors-card"
              >
                <Avatar src={mentor.avatarUrl} name={mentor.name} size={64} />
                <h3>{mentor.name}</h3>
                <p className="mentors-card-offering">
                  {mentor.offerings[0].title}
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
