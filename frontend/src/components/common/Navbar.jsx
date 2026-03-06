import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/dashboard" style={styles.brandLink}>NodeManager</Link>
      </div>

      <div style={styles.links}>
        <Link to="/dashboard" style={{ ...styles.link, ...(isActive("/dashboard") ? styles.activeLink : {}) }}>
          Dashboard
        </Link>
        <Link to="/nodes" style={{ ...styles.link, ...(isActive("/nodes") ? styles.activeLink : {}) }}>
          Nodes
        </Link>
        {isAdmin && (
          <Link to="/admin/users" style={{ ...styles.link, ...(isActive("/admin/users") ? styles.activeLink : {}) }}>
            Users
          </Link>
        )}
      </div>

      <div style={styles.userArea}>
        <span style={styles.userInfo}>
          {user?.name} &nbsp;
          <span style={{ ...styles.badge, background: isAdmin ? "#c0392b" : "#2980b9" }}>
            {user?.role}
          </span>
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "#1a1a2e", color: "#eee", position: "sticky", top: 0, zIndex: 100 },
  brand: {},
  brandLink: { color: "#e2b96f", fontWeight: 700, fontSize: 18, textDecoration: "none" },
  links: { display: "flex", gap: 20 },
  link: { color: "#ccc", textDecoration: "none", fontSize: 14 },
  activeLink: { color: "#e2b96f", borderBottom: "2px solid #e2b96f", paddingBottom: 2 },
  userArea: { display: "flex", alignItems: "center", gap: 12 },
  userInfo: { fontSize: 13, color: "#ccc" },
  badge: { padding: "2px 8px", borderRadius: 10, fontSize: 11, color: "#fff", fontWeight: 600 },
  logoutBtn: { background: "transparent", border: "1px solid #555", color: "#ccc", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontSize: 13 },
};

export default Navbar;
