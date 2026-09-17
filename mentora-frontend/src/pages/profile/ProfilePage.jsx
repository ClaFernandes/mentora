import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getMentorProfile } from "../../services/mentorService.js";
import { getMenteeProfile } from "../../services/menteeService.js";
import OwnProfileMentor from "./OwnProfileMentor";
import PublicMentor from "./PublicMentor";
import OwnProfileMentee from "./OwnProfileMentee";
import PublicMentee from "./PublicMentee";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const previousIdRef = useRef(id);

  if (previousIdRef.current !== id) {
    previousIdRef.current = id;
    if (!loading) setLoading(true);
    if (profileData !== null) setProfileData(null);
  }

  const isOwnProfile = !id || id === user?.id;

  const isPublicMentorRoute = location.pathname.startsWith("/mentores/");

  const role = isOwnProfile
    ? user?.role
    : isPublicMentorRoute
      ? "mentor"
      : "mentee";

  useEffect(() => {
    if (!user) return;

    if (isOwnProfile) {
      setProfileData(user);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchProfile = role === "mentor" ? getMentorProfile(id) : getMenteeProfile(id);

    fetchProfile
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id, user]);

  if (!user || loading) return null;
  if (notFound || !profileData) return <Navigate to="/rota-invalida" replace />;

  return (
    <div className="container">
      {role === "mentor" ? (
        isOwnProfile ? (
          <OwnProfileMentor mentor={profileData} />
        ) : (
          <PublicMentor mentor={profileData} />
        )
      ) : isOwnProfile ? (
        <OwnProfileMentee mentee={profileData} />
      ) : (
        <PublicMentee mentee={profileData} />
      )}
    </div>
  );
}
