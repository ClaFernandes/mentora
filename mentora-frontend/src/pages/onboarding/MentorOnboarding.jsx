import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../hooks/useTheme.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { FiCheck, FiInfo, FiMoon, FiSun } from "react-icons/fi";
import logo from "../../assets/logo-transparente-mostarda.png";
import "./Onboarding.css";

export default function MentorOnboarding() {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [areas, setAreas] = useState([]);
    const [customArea, setCustomArea] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [showAllAreas, setShowAllAreas] = useState(false);
    const [bio, setBio] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function toggleArea(area) {
        setAreas((prev) =>
            prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
        );
    }

    function addCustomArea() {
        const trimmed = customArea.trim();
        if (trimmed && !areas.includes(trimmed)) {
            setAreas((prev) => [...prev, trimmed]);
        }
        setCustomArea("");
        setShowCustomInput(false);
    }

    const visibleAreas = showAllAreas ? MENTORSHIP_AREAS : MENTORSHIP_AREAS.slice(0, 6);

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (areas.length === 0) {
            setError("Seleciona pelo menos uma área de mentoria.");
            return;
        }

        if (!bio.trim()) {
            setError("Escreve uma breve bio.");
            return;
        }

        setLoading(true);
        updateUser({
            bio,
            mentorProfile: {
                areas,
                offerings: [],
                isVerified: false,
                avgRating: 0,
            },
        });
        navigate("/perfil");
    }

    return (
        <div className="onboarding-container">
            <div className="onboarding-card">

                <button type="button" onClick={toggleTheme} className="onboarding-theme-toggle">
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                </button>

                <img src={logo} alt="Mentora" className="onboarding-logo" />
                <h2>Perfil de mentor</h2>
                <p className="onboarding-subtitle">Define as tuas áreas de mentoria</p>

                {error && <p className="onboarding-error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="onboarding-field">
                        <label>Áreas de mentoria</label>
                        <div className="onboarding-days-grid">
                            {visibleAreas.map((a) => (
                                <button
                                    key={a}
                                    type="button"
                                    className={areas.includes(a) ? "onboarding-day active" : "onboarding-day"}
                                    onClick={() => toggleArea(a)}
                                    disabled={loading}
                                >
                                    {areas.includes(a) && <FiCheck className="onboarding-day-icon" />}
                                    {a}
                                </button>
                            ))}

                            {areas
                                .filter((a) => !MENTORSHIP_AREAS.includes(a))
                                .map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        className="onboarding-day active"
                                        onClick={() => toggleArea(a)}
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
                                    value={customArea}
                                    onChange={(e) => setCustomArea(e.target.value)}
                                    placeholder="Escreve a área"
                                    disabled={loading}
                                    autoFocus
                                />
                                <button type="button" onClick={addCustomArea} disabled={loading}>
                                    Adicionar
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="onboarding-field">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Conta um pouco sobre a tua experiência e como podes ajudar..."
                            rows={4}
                            disabled={loading}
                        />
                    </div>

                    <p className="onboarding-note">
                        <FiInfo />
                        Depois de entrares, define os teus tipos de mentoria e a tua disponibilidade no teu perfil.
                    </p>

                    <button type="submit" className="onboarding-btn" disabled={loading}>
                        {loading ? "A guardar..." : "Continuar"}
                    </button>
                </form>
            </div>
        </div>
    );
}