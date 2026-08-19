import { Outlet, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import logo from "../assets/logo-transparente-mostarda.png";
import { FiMoon, FiSun } from "react-icons/fi";
import "./LandingLayout.css";

export default function LandingLayout() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="landing-layout">
            <header className="landing-header">
                <Link to="/" className="landing-header_logo">
                    <img src={logo} alt="Logo" />
                    <h1>Mentora</h1>
                </Link>

                <div className="landing-header_actions">
                    <button type="button" onClick={toggleTheme} className="landing-header_theme-toggle">
                        {theme === "light" ? <FiMoon /> : <FiSun />}
                    </button>

                    <Link to="/login" className="landing-header_login">
                        Entrar
                    </Link>
                    <Link to="/register" className="landing-header_register">
                        Criar conta
                    </Link>
                </div>
            </header>

            <main className="landing-layout_main">
                <Outlet />
            </main>
        </div>
    );
}