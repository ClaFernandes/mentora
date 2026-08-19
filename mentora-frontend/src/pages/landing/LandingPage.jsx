import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar.jsx";
import { FiCheck } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import "./LandingPage.css";

const FEATURED_MENTORS = [
    { id: "1", name: "Ana Ribeiro", area: "Desenvolvimento Web", avgRating: 4.9, sessionPrice: 50, avatarUrl: "https://i.pravatar.cc/150?img=32" },
    { id: "2", name: "Ricardo Silva", area: "UX/UI Design", avgRating: 4.8, sessionPrice: 40, avatarUrl: "https://i.pravatar.cc/150?img=12" },
    { id: "3", name: "Sofia Martins", area: "Marketing Digital", avgRating: 5.0, sessionPrice: 45, avatarUrl: "https://i.pravatar.cc/150?img=48" },
];

const HERO_AVATARS = [
    { id: "h1", avatarUrl: "https://i.pravatar.cc/150?img=16" },
    { id: "h2", avatarUrl: "https://i.pravatar.cc/150?img=23" },
    { id: "h3", avatarUrl: "https://i.pravatar.cc/150?img=68" },
];

const STEPS = [
    { number: "1", title: "Cria a tua conta", description: "Regista-te gratuitamente como mentor ou mentorado em poucos minutos." },
    { number: "2", title: "Encontra o mentor certo", description: "Filtra por área, preço e avaliação para encontrares quem melhor te pode ajudar." },
    { number: "3", title: "Agenda e evolui", description: "Marca a tua sessão, paga com segurança, e acompanha a tua evolução na plataforma." },
];

export default function LandingPage() {
    return (
        <div className="landing">
            <section className="landing_hero">
                <div className="landing_hero-text">
                    <span className="landing_badge">Plataforma de mentoria online</span>
                    <h1>Aprende com quem já percorreu o caminho</h1>
                    <p className="landing_hero-sub">
                        Encontra mentores experientes, agenda sessões pagas e acompanha a
                        tua evolução numa comunidade dedicada ao crescimento profissional.
                    </p>
                    <div className="landing_hero-actions">
                        <Link to="/register" className="landing_btn-primary">
                            Começar gratuitamente
                        </Link>
                        <Link to="/login" className="landing_btn-outline">
                            Já tenho conta
                        </Link>
                    </div>
                    <div className="landing_hero-checks">
                        <span><FiCheck /> Registo 100% gratuito</span>
                        <span><FiCheck /> Mentores verificados</span>
                        <span><FiCheck /> Pagamento seguro</span>
                    </div>
                </div>

                <div className="landing_hero-avatars">
                    {HERO_AVATARS.map((avatar, index) => (
                        <div
                            key={avatar.id}
                            className="landing_hero-avatar"
                            style={{ zIndex: HERO_AVATARS.length - index }}
                        >
                            <Avatar src={avatar.avatarUrl} name="" size={80} />
                        </div>
                    ))}
                    <div className="landing_hero-avatar landing_hero-avatar-more">
                        +120
                    </div>
                </div>
            </section>

            <section className="landing_steps">
                <h2>Como funciona</h2>
                <div className="landing_steps-grid">
                    {STEPS.map((step) => (
                        <div key={step.number} className="landing_step">
                            <div className="landing_step-number">{step.number}</div>
                            <div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="landing_mentors">
                <h2>Mentores em destaque</h2>
                <div className="landing_mentors-grid">
                    {FEATURED_MENTORS.map((mentor) => (
                        <div key={mentor.id} className="landing_mentor-card">
                            <div className="landing_mentor-avatar-wrapper">
                                <Avatar src={mentor.avatarUrl} name={mentor.name} size={64} />
                                <FaCheckCircle
                                    className="landing_mentor-verified"
                                    title="Mentor verificado"
                                />
                            </div>
                            <h3>{mentor.name}</h3>
                            <p className="landing_mentor-area">{mentor.area}</p>
                            <p className="landing_mentor-rating">
                                <AiFillStar /> {mentor.avgRating}
                            </p>
                            <p className="landing_mentor-price">
                                a partir de {mentor.sessionPrice}€
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="landing_footer">
                <div className="landing_footer-inner">
                    <p>
                        © {new Date().getFullYear()} Mentora · Desenvolvido por Clarice
                        Fernandes
                    </p>
                    <div className="landing_footer-links">
                        <Link to="/legal" className="landing_footer-admin">
                            Termos e Privacidade
                        </Link>
                        <Link to="/admin/login" className="landing_footer-admin">
                            Acesso administrador
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}