import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer_legal">
                <Link to="/legal">Termos e Privacidade</Link>
            </div>

            <div className="footer_credits">
                <span>© {year} Mentora</span>
                <span>Desenvolvido por Clarice Fernandes</span>
            </div>
        </footer>
    );
}