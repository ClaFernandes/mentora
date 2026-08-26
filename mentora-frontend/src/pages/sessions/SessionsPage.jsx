import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { MOCK_SESSIONS, MOCK_MENTORS } from "../../mocks/mockData.js";
import { findAuthorById } from "../../utils/authorHelpers.js";
import { resolveDisplayStatus } from "../../utils/sessionHelpers.js";
import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";
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
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState("all");
    const [sessions, setSessions] = useState(MOCK_SESSIONS);
    const [cancelTarget, setCancelTarget] = useState(null);

    let mySessions = [];
    if (user.role === "mentor") {
        mySessions = sessions.filter((s) => s.mentorId === user.id);
    } else if (user.role === "mentee") {
        mySessions = sessions.filter((s) => s.menteeId === user.id);
    }

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

    function handleConfirmCancel() {
        const target = sessions.find((s) => s.id === cancelTarget.id);
        if (target) {
            target.status = "cancelled";
        }
        setSessions([...sessions]);
        setCancelTarget(null);
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
                        let otherPersonId;
                        if (user.role === "mentor") {
                            otherPersonId = session.menteeId;
                        } else {
                            otherPersonId = session.mentorId;
                        }
                        const otherPerson = findAuthorById(otherPersonId);

                        const sessionMentor = MOCK_MENTORS.find((m) => m.id === session.mentorId);
                        const offering = sessionMentor?.offerings.find((o) => o.id === session.offeringId);

                        const dateObj = new Date(`${session.date}T00:00:00`);
                        const formattedDate = format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: pt });

                        const displayStatus = resolveDisplayStatus(session);

                        const canCancel = displayStatus === "confirmed";

                        return (
                            <div key={session.id} className="session-card">
                                <Avatar src={otherPerson.avatarUrl} name={otherPerson.name} size={48} />
                                <div className="session-card_info">
                                    <h4>{otherPerson.name}</h4>
                                    <p>{offering?.title}</p>
                                    <p>{formattedDate} às {session.time}</p>
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
