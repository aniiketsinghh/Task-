import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/common/Navbar";
import { usersApi } from "../api/users.api";


const AdminUsersPage = () => {
  const [users, setUsers]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [feedback, setFeedback]   = useState(null);
  const [page, setPage]           = useState(1);

  const notify = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await usersApi.getAll({ page, limit: 10 });
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await usersApi.updateRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
      notify("success", "Role updated successfully.");
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to update role.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await usersApi.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      notify("success", "User deleted.");
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.heading}>User Management</h2>
          <p style={styles.sub}>Admin panel — manage all registered users.</p>

          {feedback && (
            <div style={{ ...styles.toast, background: feedback.type === "success" ? "#d5f5e3" : "#fdecea", color: feedback.type === "success" ? "#1e8449" : "#c0392b" }}>
              {feedback.message}
            </div>
          )}

          {error && <div style={styles.errorBanner}>{error}</div>}

          {loading ? (
            <p style={styles.empty}>Loading users...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={styles.roleSelect}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(u._id)} style={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button style={styles.pageBtn} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span style={styles.pageInfo}>Page {pagination.page} of {pagination.totalPages}</span>
              <button style={styles.pageBtn} disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  page:        { background: "#f0f2f5", minHeight: "calc(100vh - 52px)", padding: "28px 0" },
  container:   { maxWidth: 900, margin: "0 auto", padding: "0 24px" },
  heading:     { margin: "0 0 4px", fontSize: 20, color: "#1a1a2e" },
  sub:         { margin: "0 0 20px", color: "#999", fontSize: 13 },
  table:       { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" },
  th:          { textAlign: "left", padding: "10px 14px", fontSize: 12, color: "#999", background: "#fafafa", borderBottom: "1px solid #eee", textTransform: "uppercase", letterSpacing: 0.5 },
  tr:          { borderBottom: "1px solid #f5f5f5" },
  td:          { padding: "10px 14px", fontSize: 13, color: "#444" },
  roleSelect:  { padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13 },
  deleteBtn:   { padding: "4px 12px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  toast:       { padding: "10px 16px", borderRadius: 6, marginBottom: 16, fontSize: 13 },
  errorBanner: { background: "#fdecea", color: "#c0392b", padding: 10, borderRadius: 6, marginBottom: 14, fontSize: 13 },
  empty:       { color: "#999", fontSize: 14 },
  pagination:  { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 20 },
  pageBtn:     { padding: "6px 16px", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", background: "#fff", fontSize: 13 },
  pageInfo:    { fontSize: 13, color: "#666" },
};

export default AdminUsersPage;
