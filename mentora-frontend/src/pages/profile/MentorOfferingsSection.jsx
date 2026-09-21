import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
    createOffering,
    updateOffering,
    deleteOffering,
} from "../../services/offeringService.js";
import { MENTORSHIP_AREAS } from "../../utils/constants.js";
import { FaPen, FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const EMPTY_OFFERING = {
    title: "",
    area: "",
    sessionPrice: "",
    description: "",
    level: "",
};

export default function MentorOfferingsSection({ offerings }) {
    const { token, setUser } = useAuth();

    const [editingOfferingId, setEditingOfferingId] = useState(null);
    const [editingOfferingData, setEditingOfferingData] = useState(EMPTY_OFFERING);
    const [editingOfferingAreaMode, setEditingOfferingAreaMode] = useState("select");

    const [isAddingOffering, setIsAddingOffering] = useState(false);
    const [newOffering, setNewOffering] = useState(EMPTY_OFFERING);
    const [newOfferingAreaMode, setNewOfferingAreaMode] = useState("select");
    const [error, setError] = useState(null);

    function startEditingOffering(offering) {
        setEditingOfferingId(offering._id);
        setEditingOfferingData({
            title: offering.title,
            area: offering.area,
            sessionPrice: offering.sessionPrice,
            description: offering.description,
            level: offering.level,
        });
        setEditingOfferingAreaMode(
            MENTORSHIP_AREAS.includes(offering.area) ? "select" : "custom",
        );
    }

    function cancelEditingOffering() {
        setError(null);
        setEditingOfferingId(null);
    }

    async function saveOffering(offeringId) {
        setError(null);

        try {
            const updatedOffering = await updateOffering(
                token,
                offeringId,
                editingOfferingData,
            );
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
        } catch {
            setError("Não foi possível guardar a oferta. Verifica os dados e tenta novamente.");
        }
    }

    async function removeOffering(offeringId) {
        setError(null);

        try {
            await deleteOffering(token, offeringId);
            setUser((prev) => ({
                ...prev,
                mentorProfile: {
                    ...prev.mentorProfile,
                    offerings: prev.mentorProfile.offerings.filter(
                        (o) => o._id !== offeringId,
                    ),
                },
            }));
        } catch {
            setError("Não foi possível apagar a oferta. Tenta novamente.");
        }
    }

    async function addOffering() {
        setError(null);

        try {
            const createdOffering = await createOffering(token, newOffering);
            setUser((prev) => ({
                ...prev,
                mentorProfile: {
                    ...prev.mentorProfile,
                    offerings: [...prev.mentorProfile.offerings, createdOffering],
                },
            }));
            setNewOffering(EMPTY_OFFERING);
            setNewOfferingAreaMode("select");
            setIsAddingOffering(false);
        } catch {
            setError("Não foi possível criar a oferta. Verifica os dados e tenta novamente.");
        }
    }

    function cancelAddingOffering() {
        setError(null);
        setNewOffering(EMPTY_OFFERING);
        setNewOfferingAreaMode("select");
        setIsAddingOffering(false);
    }

    return (
        <section className="mentor-profile_offerings">
            <h3>Ofertas</h3>

            {error && <p className="mentor-profile_error">{error}</p>}

            {offerings.map((offering) => (
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

                            <select
                                value={editingOfferingData.level}
                                onChange={(e) =>
                                    setEditingOfferingData({
                                        ...editingOfferingData,
                                        level: e.target.value,
                                    })
                                }
                            >
                                <option value="">Selecionar nível</option>
                                <option value="iniciante">Iniciante</option>
                                <option value="intermedio">Intermédio</option>
                                <option value="avancado">Avançado</option>
                            </select>

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
                    <select
                        value={newOffering.level}
                        onChange={(e) =>
                            setNewOffering({ ...newOffering, level: e.target.value })
                        }
                    >
                        <option value="">Selecionar nível</option>
                        <option value="iniciante">Iniciante</option>
                        <option value="intermedio">Intermédio</option>
                        <option value="avancado">Avançado</option>
                    </select>
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
    );
}