import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMentorProfile } from "../../services/mentorService.js";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";

export default function MentorBioSection({ bio }) {
    const { token, setUser } = useAuth();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioText, setBioText] = useState(bio);

    async function saveBio() {
        const updatedProfile = await updateMentorProfile(token, { bio: bioText });
        setUser((prev) => ({ ...prev, bio: updatedProfile.bio }));
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
                    <div className="mentor-profile_bio-edit-actions">
                        <button onClick={saveBio} aria-label="Guardar bio">
                            <FaCheck />
                        </button>
                        <button
                            onClick={() => setIsEditingBio(false)}
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