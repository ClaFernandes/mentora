import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";
import Avatar from "./Avatar.jsx";
import NotificationBell from "./NotificationBell.jsx";
import ChatBell from "./ChatBell.jsx";
import logo from "../assets/logo-transparente-mostarda.png";
import { FiMoon, FiSun, FiLogOut, FiSearch } from "react-icons/fi";
import "./Header.css";

const NAV_ITEMS = [
    { to: "/feed", label: "Feed", roles: ["mentor", "mentee"] },
    { to: "/mentores", label: "Mentores", roles: ["mentor", "mentee"] },
    { to: "/sessoes", label: "Sessões", roles: ["mentor", "mentee"] },
];

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const { theme, toggleTheme } = useTheme();

    if (!user) return null;

    function search(e) {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/mentores?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

    return (
        <header className="header">
            <NavLink to="/feed" className="header_logo">
                <img src={logo} alt="Logo" />
                <h1>Mentora</h1>
            </NavLink>

            <form className="header_search" onSubmit={search}>
                <div className="header_search-wrapper">
                    <FiSearch className="header_search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por área ou mentores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </form>

            <nav className="header_nav">
                {visibleNavItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            isActive ? "header_nav-link header_nav-link-active" : "header_nav-link"
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <span className="header_divider" />

            <div className="header_actions">
                <ChatBell />
                <NotificationBell />

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="header_theme-toggle"
                >
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                </button>

                <NavLink to="/perfil" className="header_user">
                    <Avatar src={user.avatarUrl} name={user.name} surname={user.surname} size={32} />
                    <span>{user.name} {user.surname}</span>
                </NavLink>

                <button type="button" onClick={handleLogout} className="header_logout">
                    <FiLogOut /> Sair
                </button>
            </div>
        </header>
    );
}

