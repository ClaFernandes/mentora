import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

export function useBooking() {
    return useContext(BookingContext);
}