import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Avatar from "../../components/Avatar.jsx";
import { updateMenteeProfile } from "../../services/menteeService.js";
import { getMentorProfile } from "../../services/mentorService.js";
import { unfollowMentor } from "../../services/followService.js";
import { uploadImage } from "../../services/uploadService.js";
import { deleteAccount, updateAvatar } from "../../services/userService.js";
import { getFavorites } from "../../services/favoriteService.js";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { FaCheck, FaTimes } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { FiX, FiCamera, FiTrash2, FiEdit2 } from "react-icons/fi";
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
    mentee.menteeProfile?.interests || [],
  );
  const [showCustomInterestInput, setShowCustomInterestInput] = useState(false);
  const [customInterest, setCustomInterest] = useState("");
  const [followedMentors, setFollowedMentors] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const avatarInputRef = useRef(null);
  const avatarMenuRef = useRef(null);

  useEffect(() => {
    const followingIds = mentee.menteeProfile.followingMentors || [];
    if (followingIds.length === 0) {
      setFollowedMentors([]);
      return;
    }
    Promise.all(followingIds.map((id) => getMentorProfile(id))).then(
      setFollowedMentors,
    );
  }, [mentee.menteeProfile.followingMentors]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getFavorites(token).then(setFavorites);
  }, [token]);

  async function saveBio() {
    const updatedProfile = await updateMenteeProfile(token, { bio: bioText });
    setUser((prev) => ({ ...prev, bio: updatedProfile.bio }));
    setIsEditingBio(false);
  }
  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const uploadResult = await uploadImage(token, file);
      await updateAvatar(token, uploadResult.url);
      setUser((prev) => ({ ...prev, avatarUrl: uploadResult.url }));
    } finally {
      setUploadingAvatar(false);
      setShowAvatarMenu(false);
    }
  }

  async function handleRemoveAvatar() {
    setUploadingAvatar(true);
    try {
      await updateAvatar(token, "");
      setUser((prev) => ({ ...prev, avatarUrl: "" }));
    } finally {
      setUploadingAvatar(false);
      setShowAvatarMenu(false);
    }
  }

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
    const updatedProfile = await updateMenteeProfile(token, { interests: selectedInterests });
    setUser((prev) => ({
      ...prev,
      menteeProfile: { ...prev.menteeProfile, interests: updatedProfile.interests }
    }));
    setIsEditingInterests(false);
  }

  function cancelEditingInterests() {
    setSelectedInterests(mentee.menteeProfile?.interests || []);
    setShowCustomInterestInput(false);
    setCustomInterest("");
    setIsEditingInterests(false);
  }

  async function unfollow(mentorId) {
    await unfollowMentor(token, mentorId);

    const updated = mentee.menteeProfile.followingMentors.filter(
      (id) => id !== mentorId,
    );
    updateUser({
      menteeProfile: { ...mentee.menteeProfile, followingMentors: updated },
    });
  }

  async function handleDeleteAccount() {
    await deleteAccount(token);
    logout();
    navigate("/");
  }

  return (
    <div className="mentee-profile">
      <header className="mentee-profile_header">
        <div className="mentee-profile_avatar-wrapper" ref={avatarMenuRef}>
          <Avatar src={mentee.avatarUrl} name={mentee.name} surname={mentee.surname} size={80} />
          <button
            type="button"
            className="mentee-profile_avatar-badge"
            onClick={() => setShowAvatarMenu((prev) => !prev)}
            disabled={uploadingAvatar}
            aria-label="Opções de foto de perfil"
          >
            <FiCamera />
          </button>

          {showAvatarMenu && (
            <div className="mentee-profile_avatar-menu">
              <button type="button" onClick={() => avatarInputRef.current.click()}>
                <FiCamera /> Carregar foto
              </button>
              {mentee.avatarUrl && (
                <button type="button" className="mentee-profile_avatar-menu-danger" onClick={handleRemoveAvatar}>
                  <FiTrash2 /> Remover foto
                </button>
              )}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="mentee-profile_header-info">
          <h2>{mentee.name} {mentee.surname}</h2>
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
              <FiEdit2 />
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
              {(mentee.menteeProfile?.interests || []).map((interest) => (
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
                key={mentor._id}
                to={`/mentores/${mentor.userId._id}`}
                className="mentors-card"
              >
                <button
                  type="button"
                  className="mentee-profile_unfollow-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    unfollow(mentor.userId._id);
                  }}
                  aria-label="Deixar de seguir"
                >
                  <FiX />
                </button>
                <Avatar src={mentor.userId.avatarUrl} name={mentor.userId.name} surname={mentor.userId.surname} size={64} />
                <h3>{mentor.userId.name} {mentor.userId.surname}</h3>
                <p className="mentors-card-offering">
                  {mentor.offerings[0]?.title}
                </p>
                <p className="mentors-card-rating">
                  <AiFillStar /> {mentor.avgRating}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* OFERTAS FAVORITAS */}
      <section className="mentee-profile_favorites">
        <h3>Ofertas favoritas</h3>
        {favorites.length === 0 ? (
          <p className="mentee-profile_favorites-empty">
            Ainda não tens nenhuma oferta favorita.
          </p>
        ) : (
          <div className="mentee-profile_favorites-list">
            {favorites.map((fav) =>
              fav.offeringId ? (
                <Link
                  key={fav._id}
                  to={`/mentores/${fav.offeringId.mentorId.userId}`}
                  className="mentee-profile_favorite-card"
                >
                  <h4>{fav.offeringId.title}</h4>
                  <span>{fav.offeringId.area}</span>
                  <p>{fav.offeringId.sessionPrice}€</p>
                </Link>
              ) : (
                <div key={fav._id} className="mentee-profile_favorite-card mentee-profile_favorite-card--unavailable">
                  <h4>Oferta indisponível</h4>
                  <p>Esta oferta já não existe.</p>
                </div>
              )
            )}
          </div>
        )}
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