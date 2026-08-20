import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { MOCK_MENTORS } from "../../mocks/mockData.js";
import Avatar from "../../components/Avatar.jsx";
import { FiCheck, FiPlus, FiMoon, FiSun } from "react-icons/fi";
import logo from "../../assets/logo-transparente-mostarda.png";
import "./Onboarding.css";

const SUGGESTED_MENTORS = MOCK_MENTORS.slice(0, 6);

export default function MenteeOnboarding() {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [interests, setInterests] = useState([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const [followingMentors, setFollowingMentors] = useState([]);
    const [showAllAreas, setShowAllAreas] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function toggleInterest(area) {
        setInterests((prev) =>
            prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
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

    function toggleFollow(mentorId) {
        setFollowingMentors((prev) =>
            prev.includes(mentorId) ? prev.filter((id) => id !== mentorId) : [...prev, mentorId]
        );
    }

    const visibleAreas = showAllAreas ? MENTORSHIP_AREAS : MENTORSHIP_AREAS.slice(0, 6);

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (interests.length === 0) {
            setError("Seleciona pelo menos um interesse.");
            return;
        }

        setLoading(true);
        updateUser({
            menteeProfile: {
                interests,
                followingMentors,
            },
        });
        navigate("/feed");
    }

    return (
        <div className="onboarding-container">
            <div className="onboarding-card">
                <button type="button" onClick={toggleTheme} className="onboarding-theme-toggle">
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                </button>

                <img src={logo} alt="Mentora" className="onboarding-logo" />
                <h2>O que te interessa aprender?</h2>
                <p className="onboarding-subtitle">Escolhe os teus interesses e mentores para seguir</p>

                {error && <p className="onboarding-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="onboarding-field">
                        <label>Interesses</label>
                        <div className="onboarding-days-grid">
                            {visibleAreas.map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    className={interests.includes(a) ? "onboarding-day active" : "onboarding-day"}
                                    onClick={() => toggleInterest(a)}
                                    disabled={loading}
                                >
                                    {interests.includes(a) && <FiCheck className="onboarding-day-icon" />}
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
                                <button type="button" onClick={addCustomInterest} disabled={loading}>
                                    Adicionar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="onboarding-field">
                        <label>Sugestões de mentores para seguir</label>
                        <div className="onboarding-mentors-grid">
                            {SUGGESTED_MENTORS.map((mentor) => (
                                <button
                                    key={mentor.id}
                                    type="button"
                                    className={followingMentors.includes(mentor.id) ? "onboarding-mentor-card active" : "onboarding-mentor-card"}
                                    onClick={() => toggleFollow(mentor.id)}
                                    disabled={loading}
                                >
                                    <span className="onboarding-mentor-badge">
                                        {followingMentors.includes(mentor.id) ? <FiCheck /> : <FiPlus />}
                                    </span>
                                    <Avatar src={mentor.avatarUrl} name={mentor.name} size={48} />
                                    <span className="onboarding-mentor-name">{mentor.name}</span>
                                    <span className="onboarding-mentor-area">{mentor.offerings[0].title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="onboarding-btn" disabled={loading}>
                        {loading ? "A guardar..." : "Continuar"}
                    </button>
                </form>
            </div>
        </div>
    );
}