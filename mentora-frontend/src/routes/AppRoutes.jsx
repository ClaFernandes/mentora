import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import LandingLayout from "../layouts/LandingLayout.jsx";
import LandingPage from "../pages/landing/LandingPage.jsx";
import LegalPage from "../pages/institutional/LegalPage.jsx";
import Login from "../pages/auth/Login.jsx";
import AdminLogin from "../pages/auth/AdminLogin.jsx";
import Register from "../pages/auth/Register.jsx";
import UpdatePassword from "../pages/auth/UpdatePassword.jsx";
import NotFoundPage from "../pages/not-found/NotFoundPage.jsx";

// import MentorOnboarding from "../pages/onboarding/MentorOnboarding.jsx";
// import MenteeOnboarding from "../pages/onboarding/MenteeOnboarding.jsx";
// import FeedPage from "../pages/feed/FeedPage.jsx";
// import ProfilePage from "../pages/profile/ProfilePage.jsx";
// import BookingFlow from "../pages/booking/BookingFlow.jsx";
// import ChatWindow from "../pages/chat/ChatWindow.jsx";
// import AdminPage from "../pages/admin/AdminPage.jsx";
// import MentorsPage from "../pages/mentors/MentorsPage.jsx"; 

// Placeholder para páginas por construir. Apagar quando tiverem as páginas prontas
function Placeholder({ label }) {
    return <div style={{ padding: 24 }}>{label} — em construção</div>;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route
                path="/onboarding/mentor"
                element={
                    <ProtectedRoute role="mentor">
                        <Placeholder label="Onboarding mentor" />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/onboarding/mentee"
                element={
                    <ProtectedRoute role="mentee">
                        <Placeholder label="Onboarding mentorado" />
                    </ProtectedRoute>
                }
            />

            <Route element={<AppLayout />}>
                <Route
                    path="/feed"
                    element={
                        <ProtectedRoute>
                            <Placeholder label="Feed" />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoute>
                            <Placeholder label="Perfil" />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mentores"
                    element={
                        <ProtectedRoute>
                            <Placeholder label="Mentores" />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sessoes"
                    element={
                        <ProtectedRoute>
                            <Placeholder label="Sessões" />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/agendar/:mentorId"
                    element={
                        <ProtectedRoute>
                            <Placeholder label="Agendar sessão" />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Placeholder label="Chat" />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="admin">
                        <Placeholder label="Painel admin" />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}