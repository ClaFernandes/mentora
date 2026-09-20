import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import { updateMenteeProfile } from "../../services/menteeService.js";
import { searchMentors } from "../../services/mentorService.js";
import { followMentor } from "../../services/followService.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import Avatar from "../../components/Avatar.jsx";
import { FiCheck, FiPlus, FiMoon, FiSun } from "react-icons/fi";
import logo from "../../assets/logo-transparente-mostarda.png";
import "./Onboarding.css";

export default function MenteeOnboarding() {
  const navigate = useNavigate();
  const { token, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [interests, setInterests] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [followingMentors, setFollowingMentors] = useState([]);
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedMentors, setSuggestedMentors] = useState([]);

  useEffect(() => {
    searchMentors({ sortBy: "rating" }, 1, 6).then((result) => {
      setSuggestedMentors(result.mentors);
    });
  }, []);

  function toggleInterest(area) {
    setInterests((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  function addCustomInterest() {
    const trimmed = customValue.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests((prev) => [...prev, trimmed]);
    }
    setCustomValue("");
    setShowCustomInput(false);
  }

  function toggleFollow(mentorUserId) {
    setFollowingMentors((prev) =>
      prev.includes(mentorUserId)
        ? prev.filter((id) => id !== mentorUserId)
        : [...prev, mentorUserId],
    );
  }

  const visibleAreas = showAllAreas
    ? MENTORSHIP_AREAS
    : MENTORSHIP_AREAS.slice(0, 6);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (interests.length === 0) {
      setError("Seleciona pelo menos um interesse.");
      return;
    }
    if (!termsAccepted) {
      setError("Tens de aceitar os Termos e Condições para continuar.");
      return;
    }
    setLoading(true);

    const updatedProfile = await updateMenteeProfile(token, { interests });

    await Promise.all(
      followingMentors.map((mentorUserId) => followMentor(token, mentorUserId)),
    );

    setUser((prev) => ({
      ...prev,
      menteeProfile: {
        ...prev.menteeProfile,
        interests: updatedProfile.interests,
        followingMentors: followingMentors,
      },
    }));
    navigate("/feed");
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <button
          type="button"
          onClick={toggleTheme}
          className="onboarding-theme-toggle"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        <img src={logo} alt="Mentora" className="onboarding-logo" />
        <h2>O que te interessa aprender?</h2>
        <p className="onboarding-subtitle">
          Escolhe os teus interesses e mentores para seguir
        </p>

        {error && <p className="onboarding-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="onboarding-field">
            <label>Interesses</label>
            <div className="onboarding-days-grid">
              {visibleAreas.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={
                    interests.includes(a)
                      ? "onboarding-day active"
                      : "onboarding-day"
                  }
                  onClick={() => toggleInterest(a)}
                  disabled={loading}
                >
                  {interests.includes(a) && (
                    <FiCheck className="onboarding-day-icon" />
                  )}
                  {a}
                </button>
              ))}

              {interests
                .filter((a) => !MENTORSHIP_AREAS.includes(a))
                .map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="onboarding-day active"
                    onClick={() => toggleInterest(a)}
                    disabled={loading}
                  >
                    <FiCheck className="onboarding-day-icon" />
                    {a}
                  </button>
                ))}

              {MENTORSHIP_AREAS.length > 6 && (
                <button
                  type="button"
                  className="onboarding-day onboarding-day-toggle"
                  onClick={() => setShowAllAreas((prev) => !prev)}
                  disabled={loading}
                >
                  {showAllAreas ? "Ver menos" : "Ver mais"}
                </button>
              )}

              {!showCustomInput && (
                <button
                  type="button"
                  className="onboarding-day"
                  onClick={() => setShowCustomInput(true)}
                  disabled={loading}
                >
                  + Outra
                </button>
              )}
            </div>

            {showCustomInput && (
              <div className="onboarding-custom-interest">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Escreve a área"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={loading}
                >
                  Adicionar
                </button>
              </div>
            )}
          </div>

          <div className="onboarding-field">
            <label>Sugestões de mentores para seguir</label>
            <div className="onboarding-mentors-grid">
              {suggestedMentors.map((mentor) => (
                <button
                  key={mentor.userId._id}
                  type="button"
                  className={
                    followingMentors.includes(mentor.userId._id)
                      ? "onboarding-mentor-card active"
                      : "onboarding-mentor-card"
                  }
                  onClick={() => toggleFollow(mentor.userId._id)}
                  disabled={loading}
                >
                  <span className="onboarding-mentor-badge">
                    {followingMentors.includes(mentor.userId._id) ? (
                      <FiCheck />
                    ) : (
                      <FiPlus />
                    )}
                  </span>
                  <Avatar
                    src={mentor.userId.avatarUrl}
                    name={mentor.userId.name}
                    size={48}
                  />
                  <span className="onboarding-mentor-name">
                    {mentor.userId.name} {mentor.userId.surname}
                  </span>
                  <span className="onboarding-mentor-area">
                    {mentor.offerings[0]?.area}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <label className="onboarding-terms">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={loading}
            />
            Li e aceito os{" "}
            <Link to="/legal" target="_blank" rel="noopener noreferrer">
              Termos e Condições
            </Link>
          </label>

          <button
            type="submit"
            className="onboarding-btn"
            disabled={loading || !termsAccepted}
          >
            {loading ? "A guardar..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
