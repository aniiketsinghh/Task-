import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNodes from "../hooks/useNodes";
import { usersApi } from "../api/users.api";
import Navbar from "../components/common/Navbar";

const STATUS_BG = { active: "#d5f5e3", inactive: "#fdecea", pending: "#fef9e7" };

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ ...styles.stat, borderTop: `4px solid ${color}` }}>
    <div style={styles.statTop}>
      <span style={styles.statIcon}>{icon}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
    <span style={styles.statLabel}>{label}</span>
  </div>
);

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const { nodes, pagination, loading, fetchNodes } = useNodes();
  const [userCount, setUserCount] = useState(null);

  useEffect(() => { fetchNodes({ limit: 5 }); }, [fetchNodes]);

  // Admin-only: fetch total user count
  useEffect(() => {
    if (isAdmin) {
      usersApi.getAll({ limit: 1 })
        .then(({ data }) => setUserCount(data.pagination?.total ?? "—"))
        .catch(() => setUserCount("—"));
    }
  }, [isAdmin]);

  const statusCounts = nodes.reduce((acc, n) => {
    acc[n.status] = (acc[n.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>

          {/* Welcome */}
          <div style={styles.welcome}>
            <div>
              <h1 style={styles.heading}>Welcome back, {user?.name} 👋</h1>
              <p style={styles.subheading}>
                Signed in as&nbsp;
                <span style={{ ...styles.rolePill, background: isAdmin ? "#c0392b" : "#2980b9" }}>
                  {isAdmin ? "🔐 Admin" : "👤 User"}
                </span>
                &nbsp;&nbsp;{user?.email}
              </p>
            </div>
            <Link to="/nodes" style={styles.ctaBtn}>Manage Nodes →</Link>
          </div>

          {/* ── Node Stats (visible to everyone) ── */}
          <p style={styles.sectionLabel}>NODE OVERVIEW</p>
          <div style={styles.statsRow}>
            <StatCard label="Total Nodes" value={pagination?.total ?? "—"} color="#2c3e50" icon="🗂" />
            <StatCard label="Active"      value={statusCounts.active   ?? 0} color="#27ae60" icon="✅" />
            <StatCard label="Inactive"    value={statusCounts.inactive ?? 0} color="#e74c3c" icon="🔴" />
            <StatCard label="Pending"     value={statusCounts.pending  ?? 0} color="#f39c12" icon="⏳" />
          </div>

          {/* ── Admin-only section ── */}
          {isAdmin && (
            <>
              <p style={styles.sectionLabel}>ADMIN PANEL</p>
              <div style={styles.adminGrid}>
                <div style={styles.adminStatCard}>
                  <span style={styles.adminStatIcon}>👥</span>
                  <div>
                    <div style={styles.adminStatValue}>{userCount ?? "—"}</div>
                    <div style={styles.adminStatLabel}>Registered Users</div>
                  </div>
                  <Link to="/admin/users" style={styles.adminStatLink}>Manage →</Link>
                </div>
                <div style={styles.adminStatCard}>
                  <span style={styles.adminStatIcon}>🛡</span>
                  <div>
                    <div style={styles.adminStatValue}>Full</div>
                    <div style={styles.adminStatLabel}>Access Level</div>
                  </div>
                  <span style={styles.adminBadge}>Admin</span>
                </div>
                <div style={styles.adminStatCard}>
                  <span style={styles.adminStatIcon}>⚙️</span>
                  <div>
                    <div style={styles.adminStatValue}>Edit & Delete</div>
                    <div style={styles.adminStatLabel}>Node Permissions</div>
                  </div>
                  <span style={{ ...styles.adminBadge, background: "#27ae60" }}>Enabled</span>
                </div>
              </div>

              <div style={styles.adminBanner}>
                <div>
                  <strong>🔐 Admin Controls</strong>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#7f6000" }}>
                    You can edit/delete any node, manage user roles, and remove accounts.
                  </p>
                </div>
                <div style={styles.adminBannerLinks}>
                  <Link to="/nodes"       style={styles.bannerLink}>Nodes</Link>
                  <Link to="/admin/users" style={{ ...styles.bannerLink, background: "#c0392b" }}>Users</Link>
                </div>
              </div>
            </>
          )}

          {/* ── User-only notice ── */}
          {!isAdmin && (
            <div style={styles.userNotice}>
              <span>👤 You are logged in as a <strong>User</strong>. You can create nodes but cannot edit or delete them. Contact an admin for elevated access.</span>
            </div>
          )}

          {/* Recent nodes table */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Nodes</h3>
              <Link to="/nodes" style={styles.seeAll}>See all</Link>
            </div>

            {loading ? (
              <p style={styles.empty}>Loading...</p>
            ) : nodes.length === 0 ? (
              <p style={styles.empty}>No nodes yet. <Link to="/nodes">Create one →</Link></p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["Name", "Status", "Tags", "Created By", "Date"].map((h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((n) => (
                    <tr key={n._id} style={styles.tr}>
                      <td style={styles.td}>{n.name}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: STATUS_BG[n.status] }}>{n.status}</span>
                      </td>
                      <td style={styles.td}>{n.tags?.join(", ") || "—"}</td>
                      <td style={styles.td}>{n.createdBy?.name || "—"}</td>
                      <td style={styles.td}>{new Date(n.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

const styles = {
  page:             { background: "#f0f2f5", minHeight: "calc(100vh - 52px)", padding: "28px 0" },
  container:        { maxWidth: 960, margin: "0 auto", padding: "0 24px" },
  welcome:          { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  heading:          { margin: 0, fontSize: 22, color: "#1a1a2e" },
  subheading:       { margin: "6px 0 0", color: "#888", fontSize: 13, display: "flex", alignItems: "center", gap: 6 },
  rolePill:         { padding: "2px 10px", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 700 },
  ctaBtn:           { padding: "9px 20px", background: "#1a1a2e", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 14 },

  sectionLabel:     { fontSize: 11, fontWeight: 700, color: "#bbb", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" },
  statsRow:         { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 },
  stat:             { background: "#fff", borderRadius: 8, padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 6 },
  statTop:          { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statIcon:         { fontSize: 20 },
  statValue:        { fontSize: 26, fontWeight: 700, color: "#2c3e50" },
  statLabel:        { fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 1 },

  // Admin section
  adminGrid:        { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 },
  adminStatCard:    { background: "#fff", border: "1px solid #ffe082", borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 },
  adminStatIcon:    { fontSize: 24 },
  adminStatValue:   { fontSize: 15, fontWeight: 700, color: "#2c3e50" },
  adminStatLabel:   { fontSize: 11, color: "#999" },
  adminStatLink:    { marginLeft: "auto", fontSize: 13, color: "#c0392b", fontWeight: 600, textDecoration: "none" },
  adminBadge:       { marginLeft: "auto", background: "#c0392b", color: "#fff", fontSize: 11, padding: "2px 10px", borderRadius: 10, fontWeight: 700 },

  adminBanner:      { background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  adminBannerLinks: { display: "flex", gap: 8 },
  bannerLink:       { padding: "6px 14px", background: "#2c3e50", color: "#fff", borderRadius: 4, textDecoration: "none", fontSize: 13, fontWeight: 600 },

  userNotice:       { background: "#eaf4fb", border: "1px solid #aed6f1", borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#1a5276" },

  section:          { background: "#fff", borderRadius: 8, padding: 20 },
  sectionHeader:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle:     { margin: 0, fontSize: 15, color: "#333" },
  seeAll:           { fontSize: 13, color: "#2980b9", textDecoration: "none" },
  table:            { width: "100%", borderCollapse: "collapse" },
  th:               { textAlign: "left", padding: "8px 10px", fontSize: 11, color: "#999", borderBottom: "1px solid #eee", textTransform: "uppercase", letterSpacing: 0.5 },
  tr:               { borderBottom: "1px solid #f5f5f5" },
  td:               { padding: "10px 10px", fontSize: 13, color: "#444" },
  badge:            { padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, color: "#333" },
  empty:            { color: "#999", fontSize: 14 },
};

export default DashboardPage;
