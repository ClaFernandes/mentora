import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useBooking } from "../../hooks/useBooking.js";
import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { createSession, paySession } from "../../services/sessionService.js";
import { getMentorProfile } from "../../services/mentorService.js";
import { getAvailability, getAvailableSlots } from "../../services/availabilityService.js";
import "./BookingFlow.css";

export default function BookingFlow() {
    const { mentorId } = useParams();
    const location = useLocation();
    const { token } = useAuth();

    const {
        mentor,
        offering,
        step,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        setStep,
        startBooking,
    } = useBooking();

    const [currentViewDate, setCurrentViewDate] = useState(new Date());
    const [mentorAvailability, setMentorAvailability] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [bookingError, setBookingError] = useState(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonthDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);

    useEffect(() => {
        const offeringId = location.state?.offeringId;

        getMentorProfile(mentorId).then((foundMentor) => {
            const foundOffering = foundMentor.offerings.find(
                (o) => o._id === offeringId,);

            if (foundMentor && foundOffering) {
                startBooking(foundMentor, foundOffering);
            }
        })
    }, [mentorId]);

    useEffect(() => {
        getAvailability(mentorId).then(setMentorAvailability);
    }, [mentorId]);

    useEffect(() => {
        if (!selectedDate) return;

        getAvailableSlots(mentorId, selectedDate).then((slots) => {
            setTimeSlots([...slots].sort());
        });
    }, [selectedDate, mentorId]);

    if (!mentor || !offering) {
        return <p>A carregar...</p>;
    }

    const activeDaysOfWeek = [
        ...new Set(mentorAvailability.map((block) => block.dayOfWeek))
    ];

    const viewYear = currentViewDate.getFullYear();
    const viewMonth = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const calendarCells = [];

    for (let i = 0; i < startDayIndex; i++) {
        calendarCells.push({ isBlank: true, key: `blank-${i}` });
    }

    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
        const cellDate = new Date(viewYear, viewMonth, dayNum);

        const y = cellDate.getFullYear();
        const m = String(cellDate.getMonth() + 1).padStart(2, "0");
        const d = String(cellDate.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        const cellDayOfWeek = cellDate.getDay();
        const isPast = cellDate < today;
        const hasNoAvailability = !activeDaysOfWeek.includes(cellDayOfWeek);
        const isDisabled = isPast || hasNoAvailability;

        calendarCells.push({
            isBlank: false,
            key: dateStr,
            dateStr,
            dayNum,
            isPast,
            hasNoAvailability,
            isDisabled,
        });
    }

    function handlePrevMonth() {
        const prev = new Date(viewYear, viewMonth - 1, 1);
        if (prev >= minMonthDate) setCurrentViewDate(prev);
    }

    function handleNextMonth() {
        const next = new Date(viewYear, viewMonth + 1, 1);
        if (next <= maxMonthDate) setCurrentViewDate(next);
    }

    function handleSelectDate(dateStr) {
        setSelectedDate(dateStr);
        setStep("time");
    }

    async function handleConfirmBooking() {
        setBookingError(null);
        setStep("payment");

        try {
            const newSession = await createSession(token, {
                mentorId,
                offeringId: offering._id,
                date: selectedDate,
                time: selectedTime,
            });

            const { checkoutUrl } = await paySession(token, newSession._id);

            window.location.href = checkoutUrl;
        } catch (error) {
            console.error("Erro ao criar a marcação:", error);
            setBookingError("Não foi possível avançar para o pagamento. Tenta novamente.");
            setStep("confirm");
        }
    }

    const monthLabel = currentViewDate.toLocaleDateString("pt-PT", { month: "long" });
    const isPrevDisabled = new Date(viewYear, viewMonth - 1, 1) < minMonthDate;
    const isNextDisabled = new Date(viewYear, viewMonth + 1, 1) > maxMonthDate;

    return (
        <div className="booking-flow">
            <div className="booking-flow_header">
                <Avatar src={mentor.userId.avatarUrl} name={mentor.userId.name} surname={mentor.userId.surname} size={56} />
                <div className="booking-flow_header-info">
                    <h3>{mentor.userId.name} {mentor.userId.surname}</h3>
                    <p>{offering.title}</p>
                </div>
            </div>

            {step === "date" && (
                <div className="custom-calendar-card">
                    <div className="calendar-header">
                        <button type="button" className="calendar-nav-btn" onClick={handlePrevMonth} disabled={isPrevDisabled}>
                            ‹
                        </button>
                        <span className="calendar-month-title">{monthLabel}</span>
                        <button type="button" className="calendar-nav-btn" onClick={handleNextMonth} disabled={isNextDisabled}>
                            ›
                        </button>
                    </div>

                    <div className="calendar-weekdays-grid">
                        <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
                    </div>

                    <div className="calendar-days-grid">
                        {calendarCells.map((cell) => {
                            if (cell.isBlank) {
                                return <div key={cell.key} className="calendar-cell blank-cell"></div>;
                            }

                            let statusClass = "";
                            if (cell.isPast) statusClass = "past-day";
                            else if (cell.hasNoAvailability) statusClass = "no-hours-day";
                            else if (selectedDate === cell.dateStr) statusClass = "selected-day";

                            return (
                                <button
                                    key={cell.key}
                                    type="button"
                                    className={`calendar-cell day-btn ${statusClass}`}
                                    disabled={cell.isDisabled}
                                    onClick={() => handleSelectDate(cell.dateStr)}
                                >
                                    {cell.dayNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {step === "time" && (
                <div className="time-section">
                    <h2>Escolhe um horário</h2>

                    {timeSlots.length === 0 ? (
                        <EmptyState message="Sem horários disponíveis para este dia." />
                    ) : (
                        <div className="time-grid">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    className="time-slot-btn"
                                    onClick={() => {
                                        setSelectedTime(slot);
                                        setStep("confirm");
                                    }}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )}

                    <button type="button" className="onboarding-btn-back" onClick={() => setStep("date")}>
                        ← Voltar
                    </button>
                </div>
            )}

            {step === "confirm" && (
                <div className="page-header">
                    <h2>Revisa a tua marcação</h2>

                    <div className="summary-card">
                        <h3>{mentor.userId.name} {mentor.userId.surname}</h3>
                        <p><strong>Oferta:</strong> {offering.title} ({offering.sessionPrice}€)</p>
                        <p><strong>Dia:</strong> {selectedDate} às {selectedTime}</p>
                    </div>

                    <p className="booking-chat-notice">
                        O link da videochamada será combinado diretamente com o
                        mentor através do chat, após a confirmação da sessão.
                    </p>

                    {bookingError && <p className="booking-error">{bookingError}</p>}

                    <div className="summary-btns">
                        <button type="button" className="onboarding-btn-back" onClick={() => setStep("time")}>
                            ← Voltar
                        </button>
                        <button type="button" className="confirm-booking-btn" onClick={handleConfirmBooking}>
                            Confirmar e ir para pagamento
                        </button>
                    </div>
                </div>
            )}

            {step === "payment" && (
                <div className="page-header page-concluded">
                    <h2>A preparar o pagamento...</h2>
                    <p>Vais ser redirecionado para o Stripe em instantes.</p>
                </div>
            )}
        </div>
    );
}