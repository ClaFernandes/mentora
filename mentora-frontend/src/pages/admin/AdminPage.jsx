import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    MOCK_MENTORS,
    MOCK_MENTEES,
    MOCK_SESSIONS,
    MOCK_POSTS,
    MOCK_COMMENTS,
    MOCK_ADMINS,
    MOCK_ADMIN_USER,
} from "../../mocks/mockData.js";
import { resolveDisplayStatus } from "../../utils/sessionHelpers.js";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./AdminUsers.jsx";
import AdminModeration from "./AdminModeration.jsx";
import AdminAdmins from "./AdminAdmins.jsx";
import AdminModal from "./AdminModal.jsx";
import "./AdminPage.css";

const TABS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "Utilizadores" },
    { key: "moderation", label: "Moderação" },
    { key: "admins", label: "Administradores" },
];

export default function AdminPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "dashboard";
    const [mentors, setMentors] = useState(MOCK_MENTORS);
    const [mentees, setMentees] = useState(MOCK_MENTEES);
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [admins, setAdmins] = useState(MOCK_ADMINS);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showAllMentors, setShowAllMentors] = useState(false);
    const [showAllMentees, setShowAllMentees] = useState(false);
    const [showAllModMentors, setShowAllModMentors] = useState(false);
    const [showAllModMentees, setShowAllModMentees] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [newAdminName, setNewAdminName] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");

    function setActiveTab(tabKey) {
        setSearchParams({ tab: tabKey });
    }

    function showSuccess(message) {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 4000);
    }

    function handleApproveMentor(mentorId) {
        const mentor = mentors.find((m) => m.id === mentorId);
        if (mentor) {
            mentor.isVerified = true;
            showSuccess(`${mentor.name} foi aprovado(a) e já aparece publicamente.`);
        }
        setMentors([...mentors]);
    }

    function handleRemoveContent(type, id) {
        if (type === "post") {
            setPosts(posts.filter((p) => p.id !== id));
        } else {
            setComments(comments.filter((c) => c.id !== id));
        }
        showSuccess("Conteúdo removido com sucesso.");
    }

    function handleDismissReport(type, id) {
        if (type === "post") {
            setPosts(posts.map((p) => (p.id === id ? { ...p, reported: false } : p)));
        } else {
            setComments(comments.map((c) => (c.id === id ? { ...c, reported: false } : c)));
        }
        showSuccess("Denúncia rejeitada — o conteúdo continua visível.");
    }

    function handleRequestStatusChange(accountType, id, name, currentStatus) {
        setConfirmAction({ kind: "status", accountType, id, name, currentStatus });
    }

    function handleRequestDeleteAccount(accountType, id, name) {
        setConfirmAction({ kind: "delete-account", accountType, id, name });
    }

    function handleRequestRemoveAdmin(id, name) {
        setConfirmAction({ kind: "remove-admin", id, name });
    }

    function handleRequestRejectMentor(id, name) {
        setConfirmAction({ kind: "reject-mentor", id, name });
    }

    function handleConfirmAction() {
        if (confirmAction.kind === "status") {
            const { accountType, id, name, currentStatus } = confirmAction;
            const newStatus = currentStatus === "active" ? "suspended" : "active";

            if (accountType === "mentor") {
                const mentor = mentors.find((m) => m.id === id);
                if (mentor) mentor.status = newStatus;
                setMentors([...mentors]);
            } else {
                const mentee = mentees.find((m) => m.id === id);
                if (mentee) mentee.status = newStatus;
                setMentees([...mentees]);
            }

            const actionLabel = newStatus === "suspended" ? "suspensa" : "reativada";
            showSuccess(`A conta de ${name} foi ${actionLabel}.`);
        }

        if (confirmAction.kind === "delete-account") {
            const { accountType, id, name } = confirmAction;

            if (accountType === "mentor") {
                setMentors(mentors.filter((m) => m.id !== id));
            } else {
                setMentees(mentees.filter((m) => m.id !== id));
            }

            showSuccess(`A conta de ${name} foi apagada permanentemente.`);
        }

        if (confirmAction.kind === "remove-admin") {
            const { id, name } = confirmAction;
            setAdmins(admins.filter((a) => a.id !== id));
            showSuccess(`${name} deixou de ser administrador(a).`);
        }

        if (confirmAction.kind === "reject-mentor") {
            const { id, name } = confirmAction;
            const mentor = mentors.find((m) => m.id === id);
            if (mentor) {
                mentor.rejected = true;
            }
            setMentors([...mentors]);
            showSuccess(`A candidatura de ${name} foi rejeitada.`);
        }

        setConfirmAction(null);
    }

    function handleAddAdmin() {
        if (!newAdminName.trim() || !newAdminEmail.trim()) {
            return;
        }

        const newAdmin = {
            id: `admin-${Date.now()}`,
            name: newAdminName.trim(),
            email: newAdminEmail.trim(),
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString(),
        };

        setAdmins([...admins, newAdmin]);
        showSuccess(`${newAdmin.name} foi adicionado(a) como administrador(a).`);
        setNewAdminName("");
        setNewAdminEmail("");
    }

    const totalMentors = mentors.length;
    const totalMentees = mentees.length;

    let completedSessions = 0;
    let totalRevenue = 0;

    for (const session of MOCK_SESSIONS) {
        if (resolveDisplayStatus(session) === "completed") {
            completedSessions++;

            const sessionMentor = mentors.find((m) => m.id === session.mentorId);
            const offering = sessionMentor?.offerings.find((o) => o.id === session.offeringId);
            if (offering) {
                totalRevenue += offering.sessionPrice;
            }
        }
    }

    // Mentores por aprovar (exclui os já rejeitados) e já aprovados
    const pendingMentors = mentors.filter((m) => !m.isVerified && !m.rejected);
    const pendingMentorsCount = pendingMentors.length;
    const approvedMentors = mentors.filter((m) => m.isVerified);

    // Conteúdo denunciado 
    const reportedPosts = posts.filter((p) => p.reported);
    const reportedComments = comments.filter((c) => c.reported);
    const reportedContentCount = reportedPosts.length + reportedComments.length;

    // Contas suspensas 
    const suspendedMentorsCount = mentors.filter((m) => m.status === "suspended").length;
    const suspendedMenteesCount = mentees.filter((m) => m.status === "suspended").length;
    const suspendedAccountsCount = suspendedMentorsCount + suspendedMenteesCount;

    // Top 3 mentores 
    const topRatedMentors = [...mentors]
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 3);

    // Listas cortadas para "ver mais" na aba Utilizadores
    const visibleMentors = showAllMentors ? approvedMentors : approvedMentors.slice(0, 5);
    const visibleMentees = showAllMentees ? mentees : mentees.slice(0, 5);

    // Listas cortadas para "ver mais" na aba Moderação
    const moderationMentors = mentors.filter((m) => !m.rejected);
    const visibleModMentors = showAllModMentors ? moderationMentors : moderationMentors.slice(0, 5);
    const visibleModMentees = showAllModMentees ? mentees : mentees.slice(0, 5);

    // Gráfico
    const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    const monthlyData = {};

    for (const session of MOCK_SESSIONS) {
        if (resolveDisplayStatus(session) === "completed") {
            const sessionDate = new Date(`${session.date}T00:00:00`);
            const monthIndex = sessionDate.getMonth();
            const monthLabel = MONTH_NAMES[monthIndex];

            if (!monthlyData[monthLabel]) {
                monthlyData[monthLabel] = { mes: monthLabel, sessoes: 0, receita: 0 };
            }

            const sessionMentor = mentors.find((m) => m.id === session.mentorId);
            const offering = sessionMentor?.offerings.find((o) => o.id === session.offeringId);
            const price = offering ? offering.sessionPrice : 0;

            monthlyData[monthLabel].sessoes += 1;
            monthlyData[monthLabel].receita += price;
        }
    }

    const chartData = Object.values(monthlyData);

    return (
        <div className="admin-page">
            <h2>Painel de Administração</h2>
            <div className="admin-tabs">
                {TABS.map((tab) => {
                    let btnClass = "admin-tab-btn";
                    if (activeTab === tab.key) {
                        btnClass = "admin-tab-btn admin-tab-btn--active";
                    }

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            className={btnClass}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {successMessage && (
                <div className="admin-success-banner">{successMessage}</div>
            )}

            {activeTab === "dashboard" && (
                <AdminDashboard
                    totalMentors={totalMentors}
                    totalMentees={totalMentees}
                    completedSessions={completedSessions}
                    totalRevenue={totalRevenue}
                    pendingMentorsCount={pendingMentorsCount}
                    reportedContentCount={reportedContentCount}
                    suspendedAccountsCount={suspendedAccountsCount}
                    topRatedMentors={topRatedMentors}
                    chartData={chartData}
                    setActiveTab={setActiveTab}
                />
            )}

            {activeTab === "users" && (
                <AdminUsers
                    pendingMentors={pendingMentors}
                    approvedMentors={approvedMentors}
                    mentees={mentees}
                    visibleMentors={visibleMentors}
                    visibleMentees={visibleMentees}
                    showAllMentors={showAllMentors}
                    showAllMentees={showAllMentees}
                    setShowAllMentors={setShowAllMentors}
                    setShowAllMentees={setShowAllMentees}
                    handleApproveMentor={handleApproveMentor}
                    handleRequestRejectMentor={handleRequestRejectMentor}
                />
            )}

            {activeTab === "moderation" && (
                <AdminModeration
                    reportedPosts={reportedPosts}
                    reportedComments={reportedComments}
                    reportedContentCount={reportedContentCount}
                    handleDismissReport={handleDismissReport}
                    handleRemoveContent={handleRemoveContent}
                    mentors={moderationMentors}
                    mentees={mentees}
                    visibleModMentors={visibleModMentors}
                    visibleModMentees={visibleModMentees}
                    showAllModMentors={showAllModMentors}
                    showAllModMentees={showAllModMentees}
                    setShowAllModMentors={setShowAllModMentors}
                    setShowAllModMentees={setShowAllModMentees}
                    handleRequestStatusChange={handleRequestStatusChange}
                    handleRequestDeleteAccount={handleRequestDeleteAccount}
                />
            )}

            {activeTab === "admins" && (
                <AdminAdmins
                    admins={admins}
                    currentAdmin={MOCK_ADMIN_USER}
                    newAdminName={newAdminName}
                    newAdminEmail={newAdminEmail}
                    setNewAdminName={setNewAdminName}
                    setNewAdminEmail={setNewAdminEmail}
                    handleAddAdmin={handleAddAdmin}
                    handleRequestRemoveAdmin={handleRequestRemoveAdmin}
                />
            )}

            <AdminModal
                confirmAction={confirmAction}
                onCancel={() => setConfirmAction(null)}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
}
