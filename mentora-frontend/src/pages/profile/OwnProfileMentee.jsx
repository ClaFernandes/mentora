import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import { deleteAccount } from "../../services/userService.js";
import { updateMenteeProfile } from "../../services/menteeService.js";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { MOCK_MENTORS } from "../../mocks/mockData.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import "./MenteeProfile.css";
import "../mentors/MentorsPage.css";

export default function OwnProfileMentee({ mentee }) {
  const { token, setUser, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(mentee.bio);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState(
    mentee.menteeProfile.interests,
  );
  const [showCustomInterestInput, setShowCustomInterestInput] = useState(false);
  const [customInterest, setCustomInterest] = useState("");

  async function saveBio() {
    const updatedProfile = await updateMenteeProfile(token, { bio: bioText });
    setUser((prev) => ({ ...prev, bio: updatedProfile.bio }));
    setIsEditingBio(false);
  }

  // Alterna um interesse selecionado
  function toggleInterest(interest) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  // Adiciona um interesse personalizado
  function addCustomInterest() {
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
    }
    setCustomInterest("");
    setShowCustomInterestInput(false);
  }

  // Guarda os interesses escolhidos
  async function saveInterests() {
    const updatedProfile = await updateMenteeProfile(token, { interests: selectedInterests });
    setUser((prev) => ({
      ...prev,
      menteeProfile: { ...prev.menteeProfile, interests: updatedProfile.interests }
    }));
    setIsEditingInterests(false);
  }

  // Cancela a edição de interesses sem guardar
  function cancelEditingInterests() {
    setSelectedInterests(mentee.menteeProfile.interests);
    setShowCustomInterestInput(false);
    setCustomInterest("");
    setIsEditingInterests(false);
  }

  // Deixa de seguir um mentor
  function unfollow(mentorId) {
    const updated = mentee.menteeProfile.followingMentors.filter(
      (id) => id !== mentorId,
    );
    updateUser({
      menteeProfile: { ...mentee.menteeProfile, followingMentors: updated },
    });
  }

  // Apaga a própria conta — no backend vai chamar DELETE /users/me
  async function handleDeleteAccount() {
    await deleteAccount(token);
    logout();
    navigate("/");
  }

  const followedMentors = MOCK_MENTORS.filter((m) =>
    mentee.menteeProfile.followingMentors.includes(m.id),
  );

  return (
    <div className="mentee-profile">
      <header className="mentee-profile_header">
        <Avatar src={mentee.avatarUrl} name={mentee.name} size={80} />
        <div className="mentee-profile_header-info">
          <h2>{mentee.name}</h2>
        </div>
      </header>

      {/* BIO */}
      <section className="mentee-profile_bio">
        {isEditingBio ? (
          <div className="mentee-profile_bio-edit">
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
            />
            <div className="mentee-profile_bio-edit-actions">
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
          <div className="mentee-profile_bio-view">
            <p>{mentee.bio}</p>
            <button
              onClick={() => setIsEditingBio(true)}
              aria-label="Editar bio"
            >
              <FaPen />
            </button>
          </div>
        )}
      </section>

      {/* INTERESSES */}
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
              {mentee.menteeProfile.interests.map((interest) => (
                <span key={interest} className="mentee-profile_interest-badge">
                  {interest}
                </span>
              ))}
            </div>
            <button
              onClick={() => setIsEditingInterests(true)}
              aria-label="Editar interesses"
            >
              <FaPen />
            </button>
          </div>
        )}
      </section>

      {/* MENTORES SEGUIDOS */}
      <section className="mentee-profile_followed">
        <h3>Mentores seguidos</h3>
        <div className="mentors-grid">
          {followedMentors.length === 0 ? (
            <p className="mentee-profile_followed-empty">
              Ainda não segues nenhum mentor.
            </p>
          ) : (
            followedMentors.map((mentor) => (
              <Link
                key={mentor.id}
                to={`/mentores/${mentor.id}`}
                className="mentors-card"
              >
                <button
                  type="button"
                  className="mentee-profile_unfollow-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    unfollow(mentor.id);
                  }}
                  aria-label="Deixar de seguir"
                >
                  <FiX />
                </button>
                <Avatar src={mentor.avatarUrl} name={mentor.name} size={64} />
                <h3>{mentor.name}</h3>
                <p className="mentors-card-offering">
                  {mentor.offerings[0].title}
                </p>
                <p className="mentors-card-rating">
                  <AiFillStar /> {mentor.avgRating}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* APAGAR CONTA */}
      <section className="mentee-profile_danger-zone">
        <h3>Zona de perigo</h3>
        <p>Apagar a tua conta remove os teus dados de forma permanente.</p>
        <button
          type="button"
          className="mentee-profile_delete-account-btn"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Apagar conta
        </button>
      </section>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Apagar a tua conta?"
          message="Esta ação não pode ser desfeita. Todos os teus dados serão removidos da plataforma."
          confirmLabel="Sim, apagar conta"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}
