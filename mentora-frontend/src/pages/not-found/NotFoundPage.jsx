import { Link } from "react-router-dom";
import logo from "../../assets/logo-transparente-mostarda.png";
import { FiHome, FiSearch } from "react-icons/fi";
import "./NotFoundPage.css";

export default function NotFoundPage() {
    return (
        <div className="notfound">
            <div className="notfound_badge">
                <span>4</span>
                <FiSearch />
                <span>4</span>
            </div>

            <h2>Página não encontrada</h2>
            <p>A página que procuras não existe ou foi movida.</p>

            <Link to="/" className="notfound_home-btn">
                <FiHome /> Ir para a página inicial
            </Link>
        </div>
    );
}