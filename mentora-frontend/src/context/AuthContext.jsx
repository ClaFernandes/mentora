import { createContext, useState, useMemo } from "react";

export const AuthContext = createContext();

const MOCK_USER = {
    id: "mock-user-1",
    name: "Clarice Fernandes",
    email: "clarice@mail.com",
    role: "mentor", // "mentor" | "mentee" | "admin"
    status: "active", // "pending" | "active" | "rejected"
    avatarUrl: "",
    bio: "Desenvolvedora full-stack e mentora.",
    createdAt: "2026-01-10T00:00:00.000Z",
    mentorProfile: {
        area: "Desenvolvimento Web",
        sessionPrice: 45,
        isVerified: true,
        avgRating: 4.8,
    },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(MOCK_USER);
    const [loading] = useState(false);

    function logout() {
        setUser(null);
    }

    const value = useMemo(
        () => ({ user, setUser, loading, logout }),
        [user, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}