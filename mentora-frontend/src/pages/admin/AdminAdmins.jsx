import Avatar from "../../components/Avatar.jsx";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function AdminAdmins({
  admins,
  currentAdmin,
  newAdminName,
  newAdminSurname,
  newAdminBirthDate,
  newAdminEmail,
  setNewAdminName,
  setNewAdminSurname,
  setNewAdminBirthDate,
  setNewAdminEmail,
  handleAddAdmin,
  handleRequestRemoveAdmin,
}) {
  return (
    <div>
      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Administradores</h3>
          <span className="admin-section-count">{admins.length + 1}</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="admin-table-name">
                  <Avatar
                    src={currentAdmin.avatarUrl}
                    name={currentAdmin.name}
                    surname={currentAdmin.surname}
                    size={28}
                  />
                  {currentAdmin.name} {currentAdmin.surname} (tu)
                </div>
              </td>
              <td>{currentAdmin.email}</td>
              <td>—</td>
            </tr>

            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>
                  <div className="admin-table-name">
                    <Avatar
                      name={admin.name}
                      surname={admin.surname}
                      size={28}
                    />
                    {admin.name} {admin.surname}
                  </div>
                </td>
                <td>{admin.email}</td>
                <td>
                  <button
                    type="button"
                    className="admin-delete-btn"
                    title="Remover"
                    onClick={() =>
                      handleRequestRemoveAdmin(
                        admin._id,
                        `${admin.name} ${admin.surname}`,
                      )
                    }
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Adicionar administrador</h3>
        </div>

        <div className="admin-add-form">
          <input
            type="text"
            placeholder="Nome"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apelido"
            value={newAdminSurname}
            onChange={(e) => setNewAdminSurname(e.target.value)}
          />
          <input
            type="date"
            placeholder="Data de nascimento"
            value={newAdminBirthDate}
            onChange={(e) => setNewAdminBirthDate(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <button
            type="button"
            className="admin-approve-btn"
            onClick={handleAddAdmin}
          >
            <FiPlus /> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
