import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";
import Avatar from "./Avatar.jsx";
import logo from "../assets/logo-transparente-mostarda.png";
import { FiMessageCircle, FiMoon, FiSun, FiLogOut, FiSearch } from "react-icons/fi";
import "./Header.css";

const NAV_ITEMS = [
    { to: "/mentores", label: "Mentores", roles: ["mentor", "mentee"] },
    { to: "/sessoes", label: "Sessões", roles: ["mentor", "mentee"] },
];

export default function Header() {
    const { user, logout } = useAuth();
    if (!user) return null;

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    function search(e) {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/search?q=${searchQuery}`);
        }
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

    const { theme, toggleTheme } = useTheme();

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
                <NavLink to="/chat" className="header_chat-icon">
                    <FiMessageCircle />
                </NavLink>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="header_theme-toggle"
                >
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                </button>

                <NavLink to="/perfil" className="header_user">
                    <Avatar src={user.avatarUrl} name={user.name} size={32} />
                    <span>{user.name}</span>
                </NavLink>

                <button type="button" onClick={handleLogout} className="header_logout">
                    <FiLogOut /> Sair
                </button>
            </div>
        </header>
    );
}

