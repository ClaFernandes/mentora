import Avatar from "../../components/Avatar.jsx";
import { AiFillStar } from "react-icons/ai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard({
  totalMentors,
  totalMentees,
  completedSessions,
  totalRevenue,
  pendingMentorsCount,
  reportedContentCount,
  suspendedAccountsCount,
  topRatedMentors,
  chartData,
  setActiveTab,
}) {
  return (
    <>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{totalMentors}</span>
          <span className="admin-stat-label">Mentores</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{totalMentees}</span>
          <span className="admin-stat-label">Mentorados</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{completedSessions}</span>
          <span className="admin-stat-label">Sessões concluídas</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{totalRevenue}€</span>
          <span className="admin-stat-label">Receita total</span>
        </div>
      </div>

      <h4 className="admin-stats-subtitle">Precisa de atenção</h4>
      <div className="admin-stats-grid admin-stats-grid--secondary">
        <button
          type="button"
          className="admin-stat-card admin-stat-card--alert admin-stat-card--clickable"
          onClick={() => setActiveTab("users")}
        >
          <span className="admin-stat-value">{pendingMentorsCount}</span>
          <span className="admin-stat-label">Mentores por aprovar</span>
        </button>
        <button
          type="button"
          className="admin-stat-card admin-stat-card--alert admin-stat-card--clickable"
          onClick={() => setActiveTab("moderation")}
        >
          <span className="admin-stat-value">{reportedContentCount}</span>
          <span className="admin-stat-label">Conteúdo denunciado</span>
        </button>
        <button
          type="button"
          className="admin-stat-card admin-stat-card--alert admin-stat-card--clickable"
          onClick={() => setActiveTab("moderation")}
        >
          <span className="admin-stat-value">{suspendedAccountsCount}</span>
          <span className="admin-stat-label">Contas suspensas</span>
        </button>
      </div>

      <div className="admin-chart-card">
        <h3>Sessões e receita por mês</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 0, left: -12, bottom: 0 }} // NOVO: menos margem à volta
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="mes"
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 12 }} // NOVO: letra mais pequena
            />
            <YAxis
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              width={36} // NOVO: eixo mais estreito (era 60 por defeito)
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-text-secondary)"
              width={40} // NOVO: um pouco mais largo, por causa dos valores até 600
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 13 }} /> {/* NOVO: legenda mais pequena */}
            <Bar
              yAxisId="left"
              dataKey="sessoes"
              name="Sessões"
              fill="var(--color-accent-secondary)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="receita"
              name="Receita (€)"
              fill="var(--color-accent)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-top-mentors">
        <h3>Mentores mais bem avaliados</h3>
        {topRatedMentors.map((mentor, index) => (
          <div key={mentor._id} className="admin-top-mentor-item">
            <span className="admin-top-mentor-rank">{index + 1}</span>
            <Avatar
              src={mentor.avatarUrl}
              name={mentor.name}
              surname={mentor.surname}
              size={36}
            />
            <span className="admin-top-mentor-name">
              {mentor.name} {mentor.surname}
            </span>
            <span className="admin-top-mentor-rating">
              <AiFillStar /> {mentor.avgRating}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}