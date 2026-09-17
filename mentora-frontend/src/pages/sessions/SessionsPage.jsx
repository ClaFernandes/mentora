import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { getSessions, cancelSession } from "../../services/sessionService.js";
import { addFavorite, removeFavorite, getFavorites } from "../../services/favoriteService.js";
import { resolveDisplayStatus } from "../../utils/sessionHelpers.js";
import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import "./SessionsPage.css";

const FILTERS = [
    { key: "all", label: "Todos" },
    { key: "confirmed", label: "Próximos" },
    { key: "completed", label: "Concluídos" },
    { key: "cancelled", label: "Cancelados" },
];

export default function SessionsPage() {
    const { user, token } = useAuth();
    const [activeFilter, setActiveFilter] = useState("all");
    const [sessions, setSessions] = useState([]);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [favoritedOfferingIds, setFavoritedOfferingIds] = useState([]);

    useEffect(() => {
        getSessions(token).then(setSessions);
    }, [token]);

    useEffect(() => {
        if (user.role !== "mentee") return;
        getFavorites(token).then((favorites) => {
            setFavoritedOfferingIds(favorites.map((f) => f.offeringId?._id).filter(Boolean));
        });
    }, [user.role, token]);

    const mySessions = sessions;

    let filteredSessions = mySessions;
    if (activeFilter !== "all") {
        filteredSessions = mySessions.filter(
            (s) => resolveDisplayStatus(s) === activeFilter
        );
    }

    const counts = {};
    for (const session of mySessions) {
        const displayStatus = resolveDisplayStatus(session);
        counts[displayStatus] = (counts[displayStatus] || 0) + 1;
    }
    counts.all = mySessions.length;

    function handleRequestCancel(session) {
        setCancelTarget(session);
    }

    async function handleConfirmCancel() {
        const updatedSession = await cancelSession(token, cancelTarget._id);

        setSessions((prev) =>
            prev.map((s) => (s._id === updatedSession._id ? updatedSession : s))
        );
        setCancelTarget(null);
    }

    async function handleToggleFavorite(offeringId) {
        const isFavorited = favoritedOfferingIds.includes(offeringId);

        if (isFavorited) {
            await removeFavorite(token, offeringId);
            setFavoritedOfferingIds((prev) => prev.filter((id) => id !== offeringId));
        } else {
            await addFavorite(token, offeringId);
            setFavoritedOfferingIds((prev) => [...prev, offeringId]);
        }
    }

    return (
        <div className="sessions-page">
            <h2>Sessões</h2>

            <div className="sessions-filters">
                {FILTERS.map((filter) => {
                    let btnClass = "sessions-filter-btn";
                    if (activeFilter === filter.key) {
                        btnClass = "sessions-filter-btn sessions-filter-btn--active";
                    }

                    return (
                        <button
                            key={filter.key}
                            type="button"
                            className={btnClass}
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label}
                            <span className="sessions-filter-count">{counts[filter.key] || 0}</span>
                        </button>
                    );
                })}
            </div>

            {filteredSessions.length === 0 ? (
                <EmptyState message="Sem sessões para este filtro." />
            ) : (
                <div className="sessions-list">
                    {filteredSessions.map((session) => {
                        const otherPerson =
                            user.role === "mentor"
                                ? session.menteeId
                                : session.mentorId.userId;

                        const offering = session.offeringId;
                        const dateObj = new Date(`${session.date}T00:00:00`);
                        const formattedDate = format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: pt });
                        const displayStatus = resolveDisplayStatus(session);
                        const canCancel = displayStatus === "confirmed";

                        return (
                            <div key={session._id} className="session-card">
                                <Avatar src={otherPerson.avatarUrl} name={otherPerson.name} surname={otherPerson.surname} size={48} />
                                <div className="session-card_info">
                                    <h4>{otherPerson.name} {otherPerson.surname}</h4>
                                    <p>{offering?.title}</p>
                                    <p>{formattedDate} às {session.time}</p>

                                    {displayStatus === "confirmed" && (
                                        <p className="session-chat-notice">
                                            Combina o link da chamada com{" "}
                                            {user.role === "mentor" ? "o mentorado" : "o mentor"} no{" "}
                                            <Link to="/chat">chat</Link>.
                                        </p>
                                    )}
                                </div>
                                <div className="session-card_side">
                                    <span className={`session-status session-status--${displayStatus}`}>
                                        {FILTERS.find((f) => f.key === displayStatus)?.label}
                                    </span>

                                    {canCancel && (
                                        <button
                                            type="button"
                                            className="session-cancel-btn"
                                            onClick={() => handleRequestCancel(session)}
                                        >
                                            Cancelar
                                        </button>
                                    )}

                                    {user.role === "mentee" && displayStatus === "completed" && offering && (
                                        <button
                                            type="button"
                                            className="session-favorite-btn"
                                            onClick={() => handleToggleFavorite(offering._id)}
                                        >
                                            {favoritedOfferingIds.includes(offering._id) ? (
                                                <>
                                                    <AiFillHeart /> Favorito
                                                </>
                                            ) : (
                                                <>
                                                    <AiOutlineHeart /> Favoritar
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {cancelTarget && (
                <ConfirmModal
                    title="Cancelar esta sessão?"
                    message="Se ainda estiveres dentro do prazo mínimo, o valor pago é reembolsado. Fora do prazo, a sessão cancela mas sem reembolso."
                    confirmLabel="Sim, cancelar"
                    onCancel={() => setCancelTarget(null)}
                    onConfirm={handleConfirmCancel}
                />
            )}
        </div>
    );
}