import { createContext, useState, useMemo } from "react";

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [mentor, setMentor] = useState(null);
    const [offering, setOffering] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [step, setStep] = useState("date");

    function startBooking(newMentor, newOffering) {
        setMentor(newMentor);
        setOffering(newOffering);
        setSelectedDate(null);
        setSelectedTime(null);
        setStep("date");
    }

    function resetBooking() {
        setMentor(null);
        setOffering(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setStep("date");
    }

    const value = useMemo(
        () => ({
            mentor,
            offering,
            selectedDate,
            selectedTime,
            step,
            setSelectedDate,
            setSelectedTime,
            setStep,
            startBooking,
            resetBooking,
        }),
        [mentor, offering, selectedDate, selectedTime, step]
    );

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}