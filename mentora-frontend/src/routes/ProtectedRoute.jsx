import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) return <div>A carregar...</div>;

    if (!user) {
        return role === "admin"
            ? <Navigate to="/admin/login" replace />
            : <Navigate to="/login" replace />;
    }

    if (role === "admin" && user.role === "admin" && user.status !== "active") {
        return <Navigate to="/admin/login" replace />;
    }

    if (role && user.role !== role) {
        if (user.role === "mentor" || user.role === "mentee") {
            return <Navigate to="/feed" replace />;
        }
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }
    }

    return children;
}