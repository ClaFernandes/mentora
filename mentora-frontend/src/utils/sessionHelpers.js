function getSessionDateTime(session) {
    return new Date(`${session.date}T${session.time}:00`);
}

export function resolveDisplayStatus(session) {
    if (session.status === "cancelled") {
        return "cancelled";
    }

    if (session.status === "completed") {
        return "completed";
    }

    if (session.status === "confirmed") {
        const sessionDateTime = getSessionDateTime(session);
        const now = new Date();

        if (sessionDateTime < now) {
            return "completed";
        }

        return "confirmed";
    }

    return "confirmed";
}