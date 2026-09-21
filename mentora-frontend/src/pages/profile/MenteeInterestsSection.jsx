import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMenteeProfile } from "../../services/menteeService.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

export default function MenteeInterestsSection({ interests }) {
    const { token, setUser } = useAuth();
    const [isEditingInterests, setIsEditingInterests] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState(interests || []);
    const [showCustomInterestInput, setShowCustomInterestInput] = useState(false);
    const [customInterest, setCustomInterest] = useState("");
    const [error, setError] = useState(null);

    function toggleInterest(interest) {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest],
        );
    }

    function addCustomInterest() {
        const trimmed = customInterest.trim();
        if (trimmed && !selectedInterests.includes(trimmed)) {
            setSelectedInterests((prev) => [...prev, trimmed]);
        }
        setCustomInterest("");
        setShowCustomInterestInput(false);
    }

    async function saveInterests() {
        setError(null);

        try {
            const updatedProfile = await updateMenteeProfile(token, { interests: selectedInterests });
            setUser((prev) => ({
                ...prev,
                menteeProfile: { ...prev.menteeProfile, interests: updatedProfile.interests }
            }));
            setIsEditingInterests(false);
        } catch {
            setError("Não foi possível guardar os interesses. Tenta novamente.");
        }
    }

    function cancelEditingInterests() {
        setError(null);
        setSelectedInterests(interests || []);
        setShowCustomInterestInput(false);
        setCustomInterest("");
        setIsEditingInterests(false);
    }

    return (
        <section className="mentee-profile_interests">
            {isEditingInterests ? (
                <div className="mentee-profile_interests-edit">
                    <div className="mentee-profile_interests-checkboxes">
                        {MENTORSHIP_AREAS.map((interest) => (
                            <label
                                key={interest}
                                className="mentee-profile_interest-checkbox"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedInterests.includes(interest)}
                                    onChange={() => toggleInterest(interest)}
                                />
                                {interest}
                            </label>
                        ))}

                        {selectedInterests
                            .filter((i) => !MENTORSHIP_AREAS.includes(i))
                            .map((interest) => (
                                <label
                                    key={interest}
                                    className="mentee-profile_interest-checkbox"
                                >
                                    <input
                                        type="checkbox"
                                        checked
                                        onChange={() => toggleInterest(interest)}
                                    />
                                    {interest}
                                </label>
                            ))}
                    </div>

                    {!showCustomInterestInput ? (
                        <button
                            type="button"
                            onClick={() => setShowCustomInterestInput(true)}
                            className="mentee-profile_add-custom-interest"
                        >
                            + Outra
                        </button>
                    ) : (
                        <div className="mentee-profile_custom-interest">
                            <input
                                type="text"
                                value={customInterest}
                                onChange={(e) => setCustomInterest(e.target.value)}
                                placeholder="Escreve o interesse"
                                autoFocus
                            />
                            <button type="button" onClick={addCustomInterest}>
                                Adicionar
                            </button>
                        </div>
                    )}

                    {error && <p className="mentee-profile_error">{error}</p>}

                    <div className="mentee-profile_interests-edit-actions">
                        <button onClick={saveInterests} aria-label="Guardar interesses">
                            <FaCheck />
                        </button>
                        <button onClick={cancelEditingInterests} aria-label="Cancelar">
                            <FaTimes />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mentee-profile_interests-view">
                    <div className="mentee-profile_interests-badges">
                        {(interests || []).map((interest) => (
                            <span key={interest} className="mentee-profile_interest-badge">
                                {interest}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsEditingInterests(true)}
                        aria-label="Editar interesses"
                    >
                        <FiEdit2 />
                    </button>
                </div>
            )}
        </section>
    );
}