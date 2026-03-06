import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  {
    value: "user",
    label: "User",
    icon: "👤",
    color: "#2980b9",
    description: "Can view and create nodes. Cannot edit or delete.",
  },
  {
    value: "admin",
    label: "Admin",
    icon: "🔐",
    color: "#c0392b",
    description: "Full access — create, edit, delete nodes and manage users.",
  },
];

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]   = useState(1); // step 1 = pick role, step 2 = fill form
  const [role, setRole]   = useState(null);
  const [form, setForm]   = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(2);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: role.value,
    });

    if (result.success) navigate("/dashboard");
    else setError(result.message);
  };

  const selectedRole = ROLES.find((r) => r.value === role?.value);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Get started with NodeManager</p>

        {/* ── Step indicator ── */}
        <div style={styles.steps}>
          <div style={styles.stepItem}>
            <div style={{ ...styles.stepDot, background: step >= 1 ? "#1a1a2e" : "#ddd" }}>1</div>
            <span style={styles.stepText}>Choose Role</span>
          </div>
          <div style={styles.stepLine} />
          <div style={styles.stepItem}>
            <div style={{ ...styles.stepDot, background: step >= 2 ? "#1a1a2e" : "#ddd" }}>2</div>
            <span style={styles.stepText}>Your Details</span>
          </div>
        </div>

        {/* ── Step 1: Role Selection ── */}
        {step === 1 && (
          <div>
            <p style={styles.rolePrompt}>How do you want to register?</p>
            <div style={styles.roleGrid}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r)}
                  style={{ ...styles.roleCard, borderColor: r.color }}
                >
                  <span style={styles.roleIcon}>{r.icon}</span>
                  <span style={{ ...styles.roleLabel, color: r.color }}>{r.label}</span>
                  <span style={styles.roleDesc}>{r.description}</span>
                  <span style={{ ...styles.rolePill, background: r.color }}>
                    Register as {r.label}
                  </span>
                </button>
              ))}
            </div>
            <p style={styles.footer}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Registration Form ── */}
        {step === 2 && (
          <div>
            {/* Selected role badge */}
            <div style={{ ...styles.selectedBadge, borderColor: selectedRole.color }}>
              <span style={{ fontSize: 18 }}>{selectedRole.icon}</span>
              <span style={styles.selectedText}>
                Registering as&nbsp;
                <strong style={{ color: selectedRole.color }}>{selectedRole.label}</strong>
              </span>
              <button onClick={() => { setStep(1); setError(""); }} style={styles.changeBtn}>
                Change
              </button>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="John Doe" required />

              <label style={styles.label}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} placeholder="you@example.com" required />

              <label style={styles.label}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} placeholder="Min. 6 characters" required />

              <label style={styles.label}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} style={styles.input} placeholder="Repeat password" required />

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.btn, background: selectedRole.color }}
              >
                {loading ? "Creating account..." : `Create ${selectedRole.label} Account`}
              </button>
            </form>

            <p style={styles.footer}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page:          { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", padding: "40px 24px" },
  card:          { background: "#fff", padding: "36px 32px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: 460 },
  title:         { margin: "0 0 4px", fontSize: 24, color: "#1a1a2e" },
  subtitle:      { margin: "0 0 24px", color: "#999", fontSize: 13 },

  steps:         { display: "flex", alignItems: "center", marginBottom: 28 },
  stepItem:      { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  stepDot:       { width: 28, height: 28, borderRadius: "50%", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  stepText:      { fontSize: 11, color: "#999" },
  stepLine:      { flex: 1, height: 2, background: "#eee", margin: "0 10px 14px" },

  rolePrompt:    { fontSize: 14, color: "#555", marginBottom: 16 },
  roleGrid:      { display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 },
  roleCard:      { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, padding: "16px 18px", background: "#fff", border: "2px solid", borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "background 0.15s" },
  roleIcon:      { fontSize: 28 },
  roleLabel:     { fontSize: 16, fontWeight: 700 },
  roleDesc:      { fontSize: 13, color: "#777", lineHeight: 1.4 },
  rolePill:      { marginTop: 4, padding: "4px 14px", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 600 },

  selectedBadge: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "2px solid", borderRadius: 8, marginBottom: 16, background: "#fafafa" },
  selectedText:  { fontSize: 14, color: "#444", flex: 1 },
  changeBtn:     { fontSize: 12, color: "#2980b9", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },

  label:         { display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: "#555" },
  input:         { width: "100%", padding: "10px 12px", marginBottom: 14, border: "1px solid #ccc", borderRadius: 4, fontSize: 14, boxSizing: "border-box" },
  btn:           { width: "100%", padding: 11, color: "#fff", border: "none", borderRadius: 4, fontSize: 15, cursor: "pointer", marginTop: 4, fontWeight: 600 },
  error:         { background: "#fdecea", color: "#c0392b", padding: "8px 12px", borderRadius: 4, marginBottom: 14, fontSize: 13 },
  footer:        { marginTop: 20, textAlign: "center", fontSize: 13, color: "#666" },
};

export default RegisterPage;
