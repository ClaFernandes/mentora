import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getAllMentors,
  getAllMentees,
  approveMentor,
  rejectMentor,
  getReportedContent,
  dismissPostReport,
  removeReportedPost,
  dismissCommentReport,
  removeReportedComment,
  toggleUserStatus,
  deleteMentorAccount,
  deleteMenteeAccount,
  getAllAdmins,
  createAdmin,
  removeAdmin,
  getStats,
} from "../../services/adminService.js";
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

const PAGE_SIZE = 10;

export default function AdminPage() {
  const { token, user: currentAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [stats, setStats] = useState(null);

  const [pendingMentors, setPendingMentors] = useState([]);
  const [approvedMentors, setApprovedMentors] = useState([]);
  const [approvedMentorsPage, setApprovedMentorsPage] = useState(1);
  const [approvedMentorsTotalPages, setApprovedMentorsTotalPages] = useState(1);
  const [mentees, setMentees] = useState([]);
  const [menteesPage, setMenteesPage] = useState(1);
  const [menteesTotalPages, setMenteesTotalPages] = useState(1);

  const [reportedPosts, setReportedPosts] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const [reportedPage, setReportedPage] = useState(1);
  const [reportedTotalPages, setReportedTotalPages] = useState(1);

  const [admins, setAdmins] = useState([]);

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminSurname, setNewAdminSurname] = useState("");
  const [newAdminBirthDate, setNewAdminBirthDate] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  function setActiveTab(tabKey) {
    setSearchParams({ tab: tabKey });
  }

  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000);
  }

  function showError(message) {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  }

  useEffect(() => {
    if (activeTab !== "dashboard") return;
    getStats(token).then(setStats);
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab !== "users") return;
    getAllMentors(token, "pending").then((data) =>
      setPendingMentors(data.mentors),
    );
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab !== "users") return;
    getAllMentors(token, "approved", approvedMentorsPage, PAGE_SIZE).then(
      (data) => {
        setApprovedMentors(data.mentors);
        setApprovedMentorsTotalPages(data.totalPages);
      },
    );
  }, [activeTab, token, approvedMentorsPage]);

  useEffect(() => {
    if (activeTab !== "users") return;
    getAllMentees(token, menteesPage, PAGE_SIZE).then((data) => {
      setMentees(data.mentees);
      setMenteesTotalPages(data.totalPages);
    });
  }, [activeTab, token, menteesPage]);

  useEffect(() => {
    if (activeTab !== "moderation") return;
    getReportedContent(token, reportedPage, PAGE_SIZE).then((data) => {
      setReportedPosts(data.reportedPosts);
      setReportedComments(data.reportedComments);
      setReportedTotalPages(data.totalPages);
    });
  }, [activeTab, token, reportedPage]);

  useEffect(() => {
    if (activeTab !== "admins") return;
    getAllAdmins(token).then(setAdmins);
  }, [activeTab, token]);

  async function handleApproveMentor(mentorId) {
    try {
      await approveMentor(token, mentorId);
      setPendingMentors((prev) => prev.filter((m) => m._id !== mentorId));
      showSuccess("Mentor aprovado e já aparece publicamente.");
    } catch (error) {
      showError(error.message || "Não foi possível aprovar o mentor.");
    }
  }

  function handleRequestRejectMentor(id, name) {
    setConfirmAction({ kind: "reject-mentor", id, name });
  }

  function handleDismissReport(type, id) {
    (async () => {
      try {
        if (type === "post") {
          await dismissPostReport(token, id);
          setReportedPosts((prev) => prev.filter((p) => p._id !== id));
        } else {
          await dismissCommentReport(token, id);
          setReportedComments((prev) => prev.filter((c) => c._id !== id));
        }
        showSuccess("Denúncia rejeitada — o conteúdo continua visível.");
      } catch (error) {
        showError(error.message || "Não foi possível rejeitar a denúncia.");
      }
    })();
  }

  function handleRemoveContent(type, id) {
    (async () => {
      try {
        if (type === "post") {
          await removeReportedPost(token, id);
          setReportedPosts((prev) => prev.filter((p) => p._id !== id));
        } else {
          await removeReportedComment(token, id);
          setReportedComments((prev) => prev.filter((c) => c._id !== id));
        }
        showSuccess("Conteúdo removido com sucesso.");
      } catch (error) {
        showError(error.message || "Não foi possível remover o conteúdo.");
      }
    })();
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

  async function handleConfirmAction() {
    try {
      if (confirmAction.kind === "status") {
        const { accountType, id, name } = confirmAction;
        const result = await toggleUserStatus(token, id);

        if (accountType === "mentor") {
          setApprovedMentors((prev) =>
            prev.map((m) =>
              m._id === id ? { ...m, status: result.status } : m,
            ),
          );
        } else {
          setMentees((prev) =>
            prev.map((m) =>
              m._id === id ? { ...m, status: result.status } : m,
            ),
          );
        }

        const actionLabel =
          result.status === "suspended" ? "suspensa" : "reativada";
        showSuccess(`A conta de ${name} foi ${actionLabel}.`);
      }

      if (confirmAction.kind === "delete-account") {
        const { accountType, id, name } = confirmAction;

        if (accountType === "mentor") {
          await deleteMentorAccount(token, id);
          setApprovedMentors((prev) => prev.filter((m) => m._id !== id));
        } else {
          await deleteMenteeAccount(token, id);
          setMentees((prev) => prev.filter((m) => m._id !== id));
        }

        showSuccess(`A conta de ${name} foi apagada permanentemente.`);
      }

      if (confirmAction.kind === "remove-admin") {
        const { id, name } = confirmAction;
        await removeAdmin(token, id);
        setAdmins((prev) => prev.filter((a) => a._id !== id));
        showSuccess(`${name} deixou de ser administrador(a).`);
      }

      if (confirmAction.kind === "reject-mentor") {
        const { id, name } = confirmAction;
        await rejectMentor(token, id);
        setPendingMentors((prev) => prev.filter((m) => m._id !== id));
        showSuccess(`A candidatura de ${name} foi rejeitada.`);
      }
    } catch (error) {
      showError(error.message || "Não foi possível concluir a ação.");
    }

    setConfirmAction(null);
  }

  async function handleAddAdmin() {
    if (
      !newAdminName.trim() ||
      !newAdminSurname.trim() ||
      !newAdminBirthDate ||
      !newAdminEmail.trim()
    ) {
      return;
    }

    try {
      const newAdmin = await createAdmin(token, {
        name: newAdminName.trim(),
        surname: newAdminSurname.trim(),
        birthDate: newAdminBirthDate,
        email: newAdminEmail.trim(),
      });

      setAdmins((prev) => [...prev, newAdmin]);
      showSuccess(
        `${newAdmin.name} foi convidado(a) como administrador(a) — um email foi enviado para definir a password.`,
      );
      setNewAdminName("");
      setNewAdminSurname("");
      setNewAdminBirthDate("");
      setNewAdminEmail("");
    } catch (error) {
      showError(error.message || "Não foi possível adicionar o administrador.");
    }
  }

  const reportedContentCount = reportedPosts.length + reportedComments.length;

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

      {errorMessage && <div className="admin-error-banner">{errorMessage}</div>}

      {activeTab === "dashboard" && stats && (
        <AdminDashboard
          totalMentors={stats.totalMentors}
          totalMentees={stats.totalMentees}
          completedSessions={stats.completedSessions}
          totalRevenue={stats.totalRevenue}
          pendingMentorsCount={stats.pendingMentorsCount}
          reportedContentCount={stats.reportedContentCount}
          suspendedAccountsCount={stats.suspendedAccountsCount}
          topRatedMentors={stats.topRatedMentors}
          chartData={stats.chartData}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "users" && (
        <AdminUsers
          pendingMentors={pendingMentors}
          approvedMentors={approvedMentors}
          mentees={mentees}
          approvedMentorsPage={approvedMentorsPage}
          approvedMentorsTotalPages={approvedMentorsTotalPages}
          setApprovedMentorsPage={setApprovedMentorsPage}
          menteesPage={menteesPage}
          menteesTotalPages={menteesTotalPages}
          setMenteesPage={setMenteesPage}
          handleApproveMentor={handleApproveMentor}
          handleRequestRejectMentor={handleRequestRejectMentor}
          handleRequestStatusChange={handleRequestStatusChange}
          handleRequestDeleteAccount={handleRequestDeleteAccount}
        />
      )}

      {activeTab === "moderation" && (
        <AdminModeration
          reportedPosts={reportedPosts}
          reportedComments={reportedComments}
          reportedContentCount={reportedContentCount}
          handleDismissReport={handleDismissReport}
          handleRemoveContent={handleRemoveContent}
          reportedPage={reportedPage}
          reportedTotalPages={reportedTotalPages}
          setReportedPage={setReportedPage}
        />
      )}

      {activeTab === "admins" && (
        <AdminAdmins
          admins={admins}
          currentAdmin={currentAdmin}
          newAdminName={newAdminName}
          newAdminSurname={newAdminSurname}
          newAdminBirthDate={newAdminBirthDate}
          newAdminEmail={newAdminEmail}
          setNewAdminName={setNewAdminName}
          setNewAdminSurname={setNewAdminSurname}
          setNewAdminBirthDate={setNewAdminBirthDate}
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
