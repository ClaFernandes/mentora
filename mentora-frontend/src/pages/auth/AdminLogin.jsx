import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowLeft } from "react-icons/fi";
import logo from "../../assets/logo-transparente-mostarda.png";
import "./Auth.css";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();

    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        if (user.role !== "admin") {
            logout();
            setError("Acesso restrito a administradores.");
            return;
        }
        if (user.status === "pending") {
            logout();
            setError("A tua conta está a aguardar aprovação.");
            return;
        }
        if (user.status === "rejected") {
            logout();
            setError("O teu pedido de acesso foi rejeitado.");
            return;
        }

        navigate("/admin", { replace: true });
    }, [user, navigate, logout]);

    async function handleAdminLogin(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
        } catch {
            setError("Credenciais inválidas.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRecover(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            // Mailtrap
            setSuccess(email);
        } catch {
            setError("Não foi possível enviar o email. Verifica o endereço introduzido.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container admin-mode">
            <div className="auth-marketing">
                <Link to="/" className="auth-brand">
                    <img src={logo} alt="Mentora" className="auth-logo" />
                </Link>
                <div className="auth-marketing-body">
                    <h2>Painel de Administração</h2>
                    <p>Acesso restrito para gestão da plataforma.</p>
                    <ul className="auth-features">
                        <li>Monitorização de mentores e mentorados</li>
                        <li>Gestão e aprovação de pedidos</li>
                        <li>Acesso controlado por aprovação</li>
                    </ul>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-card">
                    <Link to="/" className="auth-brand">
                        <img src={logo} alt="Mentora" className="auth-logo" />
                        <span>Mentora</span>
                    </Link>

                    {mode === "login" && (
                        <>
                            <h2>Autenticação Segura</h2>
                            <p className="auth-subtitle">Introduz as tuas credenciais de administrador</p>

                            {error && <p className="auth-error">{error}</p>}

                            <form onSubmit={handleAdminLogin}>
                                <div className="auth-field">
                                    <label htmlFor="admin-email">Email</label>
                                    <div className="auth-input-wrapper">
                                        <FiMail className="auth-input-icon" />
                                        <input
                                            id="admin-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@mail.com"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label htmlFor="admin-password">Palavra-passe</label>
                                    <div className="auth-input-wrapper">
                                        <FiLock className="auth-input-icon" />
                                        <input
                                            id="admin-password"
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
                                </div>

                                <button
                                    type="button"
                                    className="auth-link"
                                    onClick={() => { setMode("recover"); setError(null); }}
                                >
                                    Esqueceste a palavra-passe?
                                </button>

                                <button type="submit" className="auth-btn" disabled={loading}>
                                    {loading ? "A entrar..." : "Entrar"}
                                </button>
                            </form>

                            <p className="auth-footer">
                                <Link to="/">Voltar à página inicial</Link>
                            </p>
                        </>
                    )}

                    {mode === "recover" && (
                        <>
                            <div className="auth-lock-icon">
                                <FiLock />
                            </div>
                            <h2>Recuperar acesso</h2>
                            <p className="auth-subtitle">
                                Introduz o email da tua conta de administrador
                            </p>

                            {success ? (
                                <div className="auth-success-box">
                                    <FiMail className="auth-success-icon" />
                                    <p>Email enviado!</p>
                                    <p>Verifica a tua caixa de entrada em</p>
                                    <p className="auth-success-email">{success}</p>
                                </div>
                            ) : (
                                <>
                                    {error && <p className="auth-error">{error}</p>}
                                    <div className="auth-info">
                                        <FiMail />
                                        <p>
                                            Receberás um link para criar uma nova palavra-passe.
                                            O link expira em 1 hora.
                                        </p>
                                    </div>
                                </>
                            )}

                            <form onSubmit={handleRecover}>
                                <div className="auth-field">
                                    <label htmlFor="recover-email">Email da conta</label>
                                    <div className="auth-input-wrapper">
                                        <FiMail className="auth-input-icon" />
                                        <input
                                            id="recover-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@mail.com"
                                            required
                                            disabled={!!success}
                                        />
                                    </div>
                                </div>
                                {!success && (
                                    <button type="submit" className="auth-btn" disabled={loading}>
                                        {loading ? "A enviar..." : "Enviar link de recuperação"}
                                    </button>
                                )}
                            </form>

                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                            >
                                <FiArrowLeft /> Voltar ao Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}