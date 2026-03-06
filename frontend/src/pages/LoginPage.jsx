import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const QUICK_LOGIN = [
  { label: "Login as Admin", email: "admin@example.com", password: "admin123", role: "admin", color: "#c0392b", icon: "🔐" },
  { label: "Login as User",  email: "user@example.com",  password: "user123",  role: "user",  color: "#2980b9", icon: "👤" },
];

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [quickLoading, setQuickLoading] = useState(null); // which quick button is loading

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) navigate("/dashboard");
    else setError(result.message);
  };

  // One-click demo login
  const handleQuickLogin = async (creds, index) => {
    setQuickLoading(index);
    setError("");
    const result = await login({ email: creds.email, password: creds.password });
    setQuickLoading(null);
    if (result.success) navigate("/dashboard");
    else setError(result.message);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.subtitle}>NodeManager — Full-Stack Assignment</p>

        {/* ── Quick Login Buttons ── */}
        <div style={styles.quickSection}>
          <p style={styles.quickLabel}>Quick Demo Login</p>
          <div style={styles.quickRow}>
            {QUICK_LOGIN.map((q, i) => (
              <button
                key={q.role}
                onClick={() => handleQuickLogin(q, i)}
                disabled={quickLoading !== null || loading}
                style={{ ...styles.quickBtn, borderColor: q.color, color: q.color }}
              >
                <span style={styles.quickIcon}>{q.icon}</span>
                {quickLoading === i ? "Logging in..." : q.label}
                <span style={{ ...styles.quickRoleBadge, background: q.color }}>{q.role}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={styles.divider}><span style={styles.dividerText}>or sign in manually</span></div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email" name="email" value={form.email}
            onChange={handleChange} style={styles.input}
            placeholder="you@example.com" required
          />
          <label style={styles.label}>Password</label>
          <input
            type="password" name="password" value={form.password}
            onChange={handleChange} style={styles.input}
            placeholder="••••••••" required
          />
          <button type="submit" disabled={loading || quickLoading !== null} style={styles.btn}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      {/* ── Role comparison card ── */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>What each role can do</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Feature</th>
              <th style={{ ...styles.th, color: "#2980b9" }}>👤 User</th>
              <th style={{ ...styles.th, color: "#c0392b" }}>🔐 Admin</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["View all nodes",        "✅", "✅"],
              ["Create nodes",          "✅", "✅"],
              ["Edit nodes",            "❌", "✅"],
              ["Delete nodes",          "❌", "✅"],
              ["View user list",        "❌", "✅"],
              ["Change user roles",     "❌", "✅"],
              ["Delete users",          "❌", "✅"],
              ["Admin dashboard stats", "❌", "✅"],
            ].map(([feature, user, admin]) => (
              <tr key={feature} style={styles.tr}>
                <td style={styles.td}>{feature}</td>
                <td style={{ ...styles.td, textAlign: "center" }}>{user}</td>
                <td style={{ ...styles.td, textAlign: "center" }}>{admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page:          { minHeight: "100vh", display: "flex", gap: 24, alignItems: "flex-start", justifyContent: "center", background: "#f0f2f5", padding: "48px 24px" },
  card:          { background: "#fff", padding: "36px 32px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: 420, flexShrink: 0 },
  title:         { margin: "0 0 4px", fontSize: 24, color: "#1a1a2e" },
  subtitle:      { margin: "0 0 24px", color: "#999", fontSize: 13 },

  quickSection:  { marginBottom: 20 },
  quickLabel:    { fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  quickRow:      { display: "flex", flexDirection: "column", gap: 10 },
  quickBtn:      { display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "#fff", border: "2px solid", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "background 0.15s" },
  quickIcon:     { fontSize: 18 },
  quickRoleBadge:{ marginLeft: "auto", padding: "2px 10px", borderRadius: 10, color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase" },

  divider:       { display: "flex", alignItems: "center", margin: "20px 0", gap: 10 },
  dividerText:   { fontSize: 12, color: "#bbb", whiteSpace: "nowrap", background: "#fff", padding: "0 8px" },

  label:         { display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: "#555" },
  input:         { width: "100%", padding: "10px 12px", marginBottom: 16, border: "1px solid #ccc", borderRadius: 4, fontSize: 14, boxSizing: "border-box" },
  btn:           { width: "100%", padding: 11, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 4, fontSize: 15, cursor: "pointer", marginTop: 4 },
  error:         { background: "#fdecea", color: "#c0392b", padding: "8px 12px", borderRadius: 4, marginBottom: 14, fontSize: 13 },
  footer:        { marginTop: 20, textAlign: "center", fontSize: 13, color: "#666" },

  infoCard:      { background: "#fff", padding: "28px 24px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: 340, flexShrink: 0, alignSelf: "flex-start", marginTop: 4 },
  infoTitle:     { margin: "0 0 16px", fontSize: 15, color: "#1a1a2e" },
  table:         { width: "100%", borderCollapse: "collapse" },
  th:            { textAlign: "center", padding: "6px 8px", fontSize: 12, color: "#999", borderBottom: "2px solid #eee", textTransform: "uppercase", letterSpacing: 0.5 },
  tr:            { borderBottom: "1px solid #f5f5f5" },
  td:            { padding: "8px 8px", fontSize: 13, color: "#444" },
};

export default LoginPage;
