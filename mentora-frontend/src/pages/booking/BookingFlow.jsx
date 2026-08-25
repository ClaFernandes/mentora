import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useBooking } from "../../hooks/useBooking.js";
import Avatar from "../../components/Avatar.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getSlotsForDay } from "../../utils/availabilityHelpers.js";
import { SESSION_DURATION_MINUTES } from "../../utils/constants.js";
import { MOCK_MENTORS, MOCK_SESSIONS } from "../../mocks/mockData.js";
import "./BookingFlow.css";

export default function BookingFlow() {
    const { mentorId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

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
        resetBooking,
    } = useBooking();

    const [currentViewDate, setCurrentViewDate] = useState(new Date());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonthDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);

    useEffect(() => {
        const foundMentor = MOCK_MENTORS.find((m) => m.id === mentorId);
        const offeringId = location.state?.offeringId;
        const foundOffering = foundMentor?.offerings.find((o) => o.id === offeringId);

        if (foundMentor && foundOffering) {
            startBooking(foundMentor, foundOffering);
        }
    }, [mentorId]);

    if (!mentor || !offering) {
        return <p>A carregar...</p>;
    }

    const activeDaysOfWeek = [...new Set(mentor.availability.map((block) => block.dayOfWeek))];

    const viewYear = currentViewDate.getFullYear();
    const viewMonth = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const calendarCells = [];

    let timeSlots = [];
    if (selectedDate) {
        const dateObj = new Date(`${selectedDate}T00:00:00`);
        const dayOfWeek = dateObj.getDay();
        timeSlots = getSlotsForDay(mentor.availability, dayOfWeek, SESSION_DURATION_MINUTES);
        timeSlots.sort();
    }

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

    function handleConfirmPayment() {
        const newSession = {
            id: `session-${Date.now()}`,
            mentorId: mentor.id,
            menteeId: user.id,
            offeringId: offering.id,
            date: selectedDate,
            time: selectedTime,
            status: "confirmed",
            rating: null,
            reviewText: null,
        };

        MOCK_SESSIONS.push(newSession);
        resetBooking();
        navigate("/sessoes");
    }

    const monthLabel = currentViewDate.toLocaleDateString("pt-PT", { month: "long" });
    const isPrevDisabled = new Date(viewYear, viewMonth - 1, 1) < minMonthDate;
    const isNextDisabled = new Date(viewYear, viewMonth + 1, 1) > maxMonthDate;

    return (
        <div className="booking-flow">
            <div className="booking-flow_header">
                <Avatar src={mentor.avatarUrl} name={mentor.name} size={56} />
                <div className="booking-flow_header-info">
                    <h3>{mentor.name}</h3>
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
                        <h3>{mentor.name}</h3>
                        <p><strong>Oferta:</strong> {offering.title} ({offering.sessionPrice}€)</p>
                        <p><strong>Dia:</strong> {selectedDate} às {selectedTime}</p>
                    </div>

                    <div className="summary-btns">
                        <button type="button" className="onboarding-btn-back" onClick={() => setStep("time")}>
                            ← Voltar
                        </button>
                        <button type="button" className="confirm-booking-btn" onClick={() => setStep("payment")}>
                            Confirmar e ir para pagamento
                        </button>
                    </div>
                </div>
            )}

            {step === "payment" && (
                <div className="page-header page-concluded">
                    <h2>Pagamento simulado</h2>
                    <div className="summary-card">
                        <p><strong>Total:</strong> {offering.sessionPrice}€</p>
                    </div>
                    <button type="button" className="confirm-booking-btn" onClick={handleConfirmPayment}>
                        Confirmar pagamento
                    </button>
                </div>
            )}
        </div>
    );
}