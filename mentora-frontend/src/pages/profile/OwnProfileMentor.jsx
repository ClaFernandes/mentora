import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { updateMentorProfile } from "../../services/mentorService.js";
import { deleteAccount } from "../../services/userService.js";
import { createOffering, updateOffering, deleteOffering } from "../../services/offeringServices.js";
import Avatar from "../../components/Avatar.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import AvailabilityCalendar from "../../components/AvailabilityCalendar.jsx";
import {
  FaCheckCircle,
  FaPen,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import "./MentorProfile.css";

export default function OwnProfileMentor({ mentor }) {
  const { token, setUser, updateUser, logout } = useAuth();

  const navigate = useNavigate();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(mentor.bio);
  const [isEditingAreas, setIsEditingAreas] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState(mentor.mentorProfile.areas);
  const [showCustomAreaInput, setShowCustomAreaInput] = useState(false);
  const [customArea, setCustomArea] = useState("");
  const [editingOfferingId, setEditingOfferingId] = useState(null);
  const [editingOfferingData, setEditingOfferingData] = useState({
    title: "",
    area: "",
    sessionPrice: "",
    description: "",
  });
  const [editingOfferingAreaMode, setEditingOfferingAreaMode] = useState("select");
  const [isAddingOffering, setIsAddingOffering] = useState(false);
  const [newOffering, setNewOffering] = useState({
    title: "",
    area: "",
    sessionPrice: "",
    description: "",
  });
  const [newOfferingAreaMode, setNewOfferingAreaMode] = useState("select");

  async function saveBio() {
    const updatedProfile = await updateMentorProfile(token, { bio: bioText });
    setUser((prev) => ({ ...prev, bio: updatedProfile.bio }));
    setIsEditingBio(false);
  }

  // Alterna uma área selecionada
  function toggleArea(area) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  // Adiciona uma área personalizada
  function addCustomArea() {
    const trimmed = customArea.trim();
    if (trimmed && !selectedAreas.includes(trimmed)) {
      setSelectedAreas((prev) => [...prev, trimmed]);
    }
    setCustomArea("");
    setShowCustomAreaInput(false);
  }

  // Guarda as áreas escolhidas
  async function saveAreas() {
    const updatedProfile = await updateMentorProfile(token, { areas: selectedAreas });
    setUser((prev) => ({
      ...prev,
      mentorProfile: { ...prev.mentorProfile, areas: updatedProfile.areas },
    }));
    setIsEditingAreas(false);
  }

  // Cancela a edição de áreas sem guardar
  function cancelEditingAreas() {
    setSelectedAreas(mentor.mentorProfile.areas);
    setShowCustomAreaInput(false);
    setCustomArea("");
    setIsEditingAreas(false);
  }

  // Prepara edição com os dados atuais da oferta clicada
  function startEditingOffering(offering) {
    setEditingOfferingId(offering._id);
    setEditingOfferingData({
      title: offering.title,
      area: offering.area,
      sessionPrice: offering.sessionPrice,
      description: offering.description,
    });
    setEditingOfferingAreaMode(
      MENTORSHIP_AREAS.includes(offering.area) ? "select" : "custom",
    );
  }

  // Cancela a edição de uma oferta
  function cancelEditingOffering() {
    setEditingOfferingId(null);
  }

  // Aplica as alterações
  async function saveOffering(offeringId) {
    const updatedOffering = await updateOffering(token, offeringId, editingOfferingData);
    setUser((prev) => ({
      ...prev,
      mentorProfile: {
        ...prev.mentorProfile,
        offerings: prev.mentorProfile.offerings.map((o) =>
          o._id === offeringId ? updatedOffering : o,
        ),
      },
    }));
    setEditingOfferingId(null);
  }

  // Remove uma oferta do array
  async function removeOffering(offeringId) {
    await deleteOffering(token, offeringId);
    setUser((prev) => ({
      ...prev,
      mentorProfile: {
        ...prev.mentorProfile,
        offerings: prev.mentorProfile.offerings.filter((o) => o._id !== offeringId),
      },
    }));
  }

  // Guarda a nova disponibilidade sempre que o calendário for editado
  function updateAvailability(newAvailability) {
    updateUser({
      mentorProfile: { ...mentor.mentorProfile, availability: newAvailability },
    });
  }

  // Apaga a própria conta 
  async function handleDeleteAccount() {
    await deleteAccount(token);
    logout();
    navigate("/");
  }

  // Cria uma nova oferta com um id único
  async function addOffering() {
    const createdOffering = await createOffering(token, newOffering);
    setUser((prev) => ({
      ...prev,
      mentorProfile: {
        ...prev.mentorProfile,
        offerings: [...prev.mentorProfile.offerings, createdOffering],
      },
    }));
    setNewOffering({ title: "", area: "", sessionPrice: "", description: "" });
    setNewOfferingAreaMode("select");
    setIsAddingOffering(false);
  }

  // Cancela a criação de nova oferta, limpando o formulário
  function cancelAddingOffering() {
    setNewOffering({ title: "", area: "", sessionPrice: "", description: "" });
    setNewOfferingAreaMode("select");
    setIsAddingOffering(false);
  }

  return (
    <div className="mentor-profile">
      {/* CABEÇALHO */}
      <header className="mentor-profile_header">
        <Avatar src={mentor.avatarUrl} name={mentor.name} size={80} />
        <div className="mentor-profile_header-info">
          <h2>
            {mentor.name}
            {mentor.mentorProfile.isVerified && (
              <FaCheckCircle
                className="mentor-profile_verified"
                title="Mentor verificado"
              />
            )}
          </h2>
        </div>
      </header>

      {/* ESTATÍSTICAS */}
      <section className="mentor-profile_meta mentor-profile_meta-readonly">
        <div className="mentor-profile_stats">
          <p className="mentor-profile_rating">
            <AiFillStar /> {mentor.mentorProfile.avgRating}
          </p>
          <p className="mentor-profile_followers">
            {mentor.mentorProfile.followersCount} seguidores
          </p>
        </div>
      </section>

      {/* BIO */}
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
            <p>{mentor.bio}</p>
            <button
              onClick={() => setIsEditingBio(true)}
              aria-label="Editar bio"
            >
              <FaPen />
            </button>
          </div>
        )}
      </section>

      {/* ÁREAS */}
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
              {mentor.mentorProfile.areas.map((area) => (
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

      {/* OFERTAS */}
      <section className="mentor-profile_offerings">
        <h3>Ofertas</h3>

        {mentor.mentorProfile.offerings.map((offering) => (
          <div key={offering._id} className="mentor-profile_offering">
            {editingOfferingId === offering._id ? (
              <div className="mentor-profile_offering-edit">
                <input
                  type="text"
                  placeholder="Título"
                  value={editingOfferingData.title}
                  onChange={(e) =>
                    setEditingOfferingData({
                      ...editingOfferingData,
                      title: e.target.value,
                    })
                  }
                />
                <select
                  value={
                    editingOfferingAreaMode === "custom"
                      ? "Outras"
                      : editingOfferingData.area
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "Outras") {
                      setEditingOfferingAreaMode("custom");
                      setEditingOfferingData({
                        ...editingOfferingData,
                        area: "",
                      });
                    } else {
                      setEditingOfferingAreaMode("select");
                      setEditingOfferingData({
                        ...editingOfferingData,
                        area: value,
                      });
                    }
                  }}
                >
                  {MENTORSHIP_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                  <option value="Outras">Outras</option>
                </select>
                {editingOfferingAreaMode === "custom" && (
                  <input
                    type="text"
                    placeholder="Escreve a área"
                    value={editingOfferingData.area}
                    onChange={(e) =>
                      setEditingOfferingData({
                        ...editingOfferingData,
                        area: e.target.value,
                      })
                    }
                  />
                )}
                <input
                  type="number"
                  placeholder="Preço"
                  value={editingOfferingData.sessionPrice}
                  onChange={(e) =>
                    setEditingOfferingData({
                      ...editingOfferingData,
                      sessionPrice: Number(e.target.value),
                    })
                  }
                />
                <textarea
                  placeholder="Descrição"
                  value={editingOfferingData.description}
                  onChange={(e) =>
                    setEditingOfferingData({
                      ...editingOfferingData,
                      description: e.target.value,
                    })
                  }
                />
                <div className="mentor-profile_offering-edit-actions">
                  <button
                    onClick={() => saveOffering(offering._id)}
                    aria-label="Guardar oferta"
                  >
                    <FaCheck />
                  </button>
                  <button onClick={cancelEditingOffering} aria-label="Cancelar">
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mentor-profile_offering-view">
                <div className="mentor-profile_offering-info">
                  <h4>{offering.title}</h4>
                  <span className="mentor-profile_offering-area">
                    {offering.area}
                  </span>
                  <span className="mentor-profile_offering-price">
                    {offering.sessionPrice}€
                  </span>
                  <p>{offering.description}</p>
                </div>

                <div className="mentor-profile_offering-actions">
                  <button
                    onClick={() => startEditingOffering(offering)}
                    aria-label="Editar oferta"
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() => removeOffering(offering._id)}
                    aria-label="Remover oferta"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAddingOffering ? (
          <div className="mentor-profile_offering-edit">
            <input
              type="text"
              placeholder="Título"
              value={newOffering.title}
              onChange={(e) =>
                setNewOffering({ ...newOffering, title: e.target.value })
              }
            />
            <select
              value={
                newOfferingAreaMode === "custom" ? "Outras" : newOffering.area
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Outras") {
                  setNewOfferingAreaMode("custom");
                  setNewOffering({ ...newOffering, area: "" });
                } else {
                  setNewOfferingAreaMode("select");
                  setNewOffering({ ...newOffering, area: value });
                }
              }}
            >
              <option value="">Selecionar área</option>
              {MENTORSHIP_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
              <option value="Outras">Outras</option>
            </select>
            {newOfferingAreaMode === "custom" && (
              <input
                type="text"
                placeholder="Escreve a área"
                value={newOffering.area}
                onChange={(e) =>
                  setNewOffering({ ...newOffering, area: e.target.value })
                }
              />
            )}
            <input
              type="number"
              placeholder="Preço"
              value={newOffering.sessionPrice}
              onChange={(e) =>
                setNewOffering({
                  ...newOffering,
                  sessionPrice: Number(e.target.value),
                })
              }
            />
            <textarea
              placeholder="Descrição"
              value={newOffering.description}
              onChange={(e) =>
                setNewOffering({
                  ...newOffering,
                  description: e.target.value,
                })
              }
            />
            <div className="mentor-profile_offering-edit-actions">
              <button onClick={addOffering} aria-label="Guardar nova oferta">
                <FaCheck />
              </button>
              <button onClick={cancelAddingOffering} aria-label="Cancelar">
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="mentor-profile_add-offering"
            onClick={() => setIsAddingOffering(true)}
          >
            + Adicionar oferta
          </button>
        )}
      </section>

      {/* DISPONIBILIDADE */}
      <section className="mentor-profile_availability">
        <h3>Disponibilidade</h3>
        <AvailabilityCalendar
          mode="edit"
          availability={mentor.mentorProfile.availability || []}
          onChange={updateAvailability}
        />
      </section>

      {/* APAGAR CONTA */}
      <section className="mentor-profile_danger-zone">
        <h3>Zona de perigo</h3>
        <p>Apagar a tua conta remove os teus dados de forma permanente.</p>
        <button
          type="button"
          className="mentor-profile_delete-account-btn"
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
