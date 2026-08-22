import { useParams, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { MOCK_MENTORS, MOCK_MENTEES } from "../../mocks/mockData";
import OwnProfileMentor from "./OwnProfileMentor";
import PublicMentor from "./PublicMentor";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const isOwnProfile = !id || id === user.id;

  const isPublicMentorRoute = location.pathname.startsWith("/mentores/");

  const role = isOwnProfile
    ? user.role
    : isPublicMentorRoute
      ? "mentor"
      : "mentee";

  const profileData = isOwnProfile
    ? user
    : role === "mentor"
      ? MOCK_MENTORS.find((m) => m.id === id)
      : MOCK_MENTEES.find((m) => m.id === id);

  if (!profileData) return <Navigate to="/rota-invalida" replace />;

  return (
    <div className="container">
      {role === "mentor" ? (
        isOwnProfile ? (
          <OwnProfileMentor mentor={profileData} />
        ) : (
          <PublicMentor mentor={profileData} />
        )
      ) : (
        <p>Perfil de mentee — a construir</p>
      )}
    </div>
  );
}
