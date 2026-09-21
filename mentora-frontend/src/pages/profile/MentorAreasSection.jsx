import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMentorProfile } from "../../services/mentorService.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";

export default function MentorAreasSection({ areas }) {
    const { token, setUser } = useAuth();
    const [isEditingAreas, setIsEditingAreas] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState(areas);
    const [showCustomAreaInput, setShowCustomAreaInput] = useState(false);
    const [customArea, setCustomArea] = useState("");
    const [error, setError] = useState(null);

    function toggleArea(area) {
        setSelectedAreas((prev) =>
            prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
        );
    }

    function addCustomArea() {
        const trimmed = customArea.trim();
        if (trimmed && !selectedAreas.includes(trimmed)) {
            setSelectedAreas((prev) => [...prev, trimmed]);
        }
        setCustomArea("");
        setShowCustomAreaInput(false);
    }

    async function saveAreas() {
        setError(null);

        try {
            const updatedProfile = await updateMentorProfile(token, {
                areas: selectedAreas,
            });
            setUser((prev) => ({
                ...prev,
                mentorProfile: { ...prev.mentorProfile, areas: updatedProfile.areas },
            }));
            setIsEditingAreas(false);
        } catch {
            setError("Não foi possível guardar as áreas. Tenta novamente.");
        }
    }

    function cancelEditingAreas() {
        setError(null);
        setSelectedAreas(areas);
        setShowCustomAreaInput(false);
        setCustomArea("");
        setIsEditingAreas(false);
    }

    return (
        <section className="mentor-profile_areas">
            {isEditingAreas ? (
                <div className="mentor-profile_areas-edit">
                    <div className="mentor-profile_areas-checkboxes">
                        {MENTORSHIP_AREAS.map((area) => (
                            <label key={area} className="mentor-profile_area-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedAreas.includes(area)}
                                    onChange={() => toggleArea(area)}
                                />
                                {area}
                            </label>
                        ))}

                        {selectedAreas
                            .filter((a) => !MENTORSHIP_AREAS.includes(a))
                            .map((area) => (
                                <label key={area} className="mentor-profile_area-checkbox">
                                    <input
                                        type="checkbox"
                                        checked
                                        onChange={() => toggleArea(area)}
                                    />
                                    {area}
                                </label>
                            ))}
                    </div>

                    {!showCustomAreaInput ? (
                        <button
                            type="button"
                            onClick={() => setShowCustomAreaInput(true)}
                            className="mentor-profile_add-custom-area"
                        >
                            + Outra
                        </button>
                    ) : (
                        <div className="mentor-profile_custom-area">
                            <input
                                type="text"
                                value={customArea}
                                onChange={(e) => setCustomArea(e.target.value)}
                                placeholder="Escreve a área"
                                autoFocus
                            />
                            <button type="button" onClick={addCustomArea}>
                                Adicionar
                            </button>
                        </div>
                    )}

                    {error && <p className="mentor-profile_error">{error}</p>}

                    <div className="mentor-profile_areas-edit-actions">
                        <button onClick={saveAreas} aria-label="Guardar áreas">
                            <FaCheck />
                        </button>
                        <button onClick={cancelEditingAreas} aria-label="Cancelar">
                            <FaTimes />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mentor-profile_areas-view">
                    <div className="mentor-profile_areas-badges">
                        {areas.map((area) => (
                            <span key={area} className="mentor-profile_area-badge">
                                {area}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsEditingAreas(true)}
                        aria-label="Editar áreas"
                    >
                        <FaPen />
                    </button>
                </div>
            )}
        </section>
    );
}