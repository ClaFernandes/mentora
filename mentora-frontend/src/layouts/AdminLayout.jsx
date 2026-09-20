import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";
import Avatar from "../components/Avatar.jsx";
import Footer from "../components/Footer.jsx";
import logo from "../assets/logo-transparente-mostarda.png";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header_logo">
          <img src={logo} alt="Logo" />
          <span>Mentora</span>
        </div>

        <div className="admin-header_actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="admin-header_theme-toggle"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>

          <Link to="/admin?tab=admins" className="admin-header_user">
            <Avatar src={user.avatarUrl} name={user.name} size={32} />
            <span>{user.name}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-header_logout"
          >
            <FiLogOut /> Sair
          </button>
        </div>
      </header>

      <main className="admin-layout_main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
