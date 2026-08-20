import { createContext, useState, useMemo } from "react";
import { MOCK_MENTEE_USER, MOCK_MENTOR_USER, MOCK_ADMIN_USER } from "../mocks/mockData.js";

export const AuthContext = createContext();

// MOCK_MENTEE_USER | MOCK_MENTOR_USER | MOCK_ADMIN_USER
const MOCK_USER = MOCK_MENTEE_USER;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(MOCK_USER);
    const [loading] = useState(false);

    function login(email, password) {
        setUser(MOCK_USER);
        return Promise.resolve(MOCK_USER);
    }

    function register(email, password, name, role) {
        const newUser = { ...MOCK_USER, email, name, role };
        setUser(newUser);
        return Promise.resolve(newUser);
    }

    function updateUser(updates) {
        setUser((prev) => ({ ...prev, ...updates }));
        return Promise.resolve();
    }

    function logout() {
        setUser(null);
    }

    const value = useMemo(
        () => ({ user, setUser, loading, login, register, updateUser, logout }),
        [user, loading],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}