import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMenteeProfile } from "../../services/menteeService.js";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

export default function MenteeBioSection({ bio }) {
    const { token, setUser } = useAuth();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(bio);
    const [error, setError] = useState(null);

    async function saveBio() {
        setError(null);

        try {
            const updatedProfile = await updateMenteeProfile(token, { bio: bioText });
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
        <section className="mentee-profile_bio">
            {isEditingBio ? (
                <div className="mentee-profile_bio-edit">
                    <textarea
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                    />

                    {error && <p className="mentee-profile_error">{error}</p>}

                    <div className="mentee-profile_bio-edit-actions">
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
                <div className="mentee-profile_bio-view">
                    <p>{bio}</p>
                    <button
                        onClick={() => setIsEditingBio(true)}
                        aria-label="Editar bio"
                    >
                        <FiEdit2 />
                    </button>
                </div>
            )}
        </section>
    );
}