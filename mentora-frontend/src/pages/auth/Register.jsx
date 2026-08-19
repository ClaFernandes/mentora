import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
    FiEye,
    FiEyeOff,
    FiMail,
    FiLock,
    FiUser,
    FiCheck,
    FiX,
} from "react-icons/fi";
import logo from "../../assets/logo-transparente-mostarda.png";
import "./Auth.css";

const passwordRules = [
    { id: "length", label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
    { id: "upper", label: "Uma letra maiúscula", test: (p) => /[A-Z]/.test(p) },
    { id: "lower", label: "Uma letra minúscula", test: (p) => /[a-z]/.test(p) },
    { id: "number", label: "Um número", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "Um carácter especial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
    const navigate = useNavigate();
    const { user, register } = useAuth();

    const [role, setRole] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        if (user.role === "mentor") navigate("/onboarding/mentor", { replace: true });
        if (user.role === "mentee") navigate("/onboarding/mentee", { replace: true });
    }, [user, navigate]);

    const rulesStatus = passwordRules.map((rule) => ({
        ...rule,
        passed: rule.test(password),
    }));
    const allRulesPassed = rulesStatus.every((r) => r.passed);
    const passwordsMatch = password === confirmPassword && confirmPassword !== "";

    async function handleRegister(e) {
        e.preventDefault();
        setError(null);

        if (!role) {
            setError("Seleciona se és mentor ou mentorado.");
            return;
        }
        if (!allRulesPassed) {
            setError("A password não cumpre todos os requisitos.");
            return;
        }
        if (!passwordsMatch) {
            setError("As passwords não coincidem.");
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name, role);
        } catch {
            setError("Erro ao criar conta. Tenta novamente.");
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-marketing">
                <Link to="/" className="auth-brand">
                    <img src={logo} alt="Mentora" className="auth-logo" />
                </Link>
                <div className="auth-marketing-body">
                    <h2>Junta-te à comunidade Mentora</h2>
                    <p>Cria a tua conta e começa hoje mesmo.</p>
                    <ul className="auth-features">
                        <li>Registo 100% gratuito</li>
                        <li>Perfil pronto em minutos</li>
                        <li>Comunidade dedicada ao crescimento</li>
                    </ul>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-card">
                    <Link to="/" className="auth-brand">
                        <img src={logo} alt="Mentora" className="auth-logo" />
                        <span>Mentora</span>
                    </Link>

                    <h2>Criar conta</h2>
                    <p className="auth-subtitle">Escolhe o teu perfil para começar</p>

                    {error && <p className="auth-error">{error}</p>}

                    <div className="auth-role-select">
                        <button
                            type="button"
                            className={role === "mentee" ? "auth-role-btn active" : "auth-role-btn"}
                            onClick={() => setRole("mentee")}
                        >
                            <span className="auth-role-title">Sou mentorado</span>
                            <span className="auth-role-desc">Quero aprender com um mentor</span>
                        </button>
                        <button
                            type="button"
                            className={role === "mentor" ? "auth-role-btn active" : "auth-role-btn"}
                            onClick={() => setRole("mentor")}
                        >
                            <span className="auth-role-title">Sou mentor</span>
                            <span className="auth-role-desc">Quero orientar e partilhar experiência</span>
                        </button>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="auth-field">
                            <label htmlFor="name">Nome completo</label>
                            <div className="auth-input-wrapper">
                                <FiUser className="auth-input-icon" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="O teu nome"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">Email</label>
                            <div className="auth-input-wrapper">
                                <FiMail className="auth-input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@email.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Palavra-passe</label>
                            <div className="auth-input-wrapper">
                                <FiLock className="auth-input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={() => setShowPassword((p) => !p)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>

                            {password.length > 0 && (
                                <ul className="auth-password-rules">
                                    {rulesStatus.map((rule) => (
                                        <li key={rule.id} className={rule.passed ? "rule-passed" : "rule-failed"}>
                                            {rule.passed ? <FiCheck /> : <FiX />}
                                            {rule.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmPassword">Confirmar palavra-passe</label>
                            <div className="auth-input-wrapper">
                                <FiLock className="auth-input-icon" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>

                            {confirmPassword.length > 0 && (
                                <p className={passwordsMatch ? "auth-match-ok" : "auth-match-error"}>
                                    {passwordsMatch ? (
                                        <><FiCheck /> As palavras-passe coincidem</>
                                    ) : (
                                        <><FiX /> As palavras-passe não coincidem</>
                                    )}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            disabled={loading || !role || !allRulesPassed || !passwordsMatch}
                        >
                            {loading ? "A criar conta..." : "Criar conta"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Já tens conta? <Link to="/login">Entra aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}