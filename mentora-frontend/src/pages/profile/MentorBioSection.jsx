import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMentorProfile } from "../../services/mentorService.js";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";

export default function MentorBioSection({ bio }) {
    const { token, setUser } = useAuth();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(bio);
    const [error, setError] = useState(null);

    async function saveBio() {
        setError(null);

        try {
            const updatedProfile = await updateMentorProfile(token, { bio: bioText });
            setUser((prev) => ({ ...prev, bio: updatedProfile.bio }));
            setIsEditingBio(false);
        } catch {
            setError("Não foi possível guardar a bio. Tenta novamente.");
        }
    }

    function cancelEditingBio() {
        setError(null);
        setIsEditingBio(false);
    }

    return (
        <section className="mentor-profile_bio">
            {isEditingBio ? (
                <div className="mentor-profile_bio-edit">
                    <textarea
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                    />

                    {error && <p className="mentor-profile_error">{error}</p>}

                    <div className="mentor-profile_bio-edit-actions">
                        <button onClick={saveBio} aria-label="Guardar bio">
                            <FaCheck />
                        </button>
                        <button
                            onClick={cancelEditingBio}
                            aria-label="Cancelar"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mentor-profile_bio-view">
                    <p>{bio}</p>
                    <button
                        onClick={() => setIsEditingBio(true)}
                        aria-label="Editar bio"
                    >
                        <FaPen />
                    </button>
                </div>
            )}
        </section>
    );
}