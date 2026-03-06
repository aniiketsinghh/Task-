import React from "react";
import { useAuth } from "../../context/AuthContext";

const STATUS_COLORS = {
  active:   { bg: "#d5f5e3", text: "#1e8449" },
  inactive: { bg: "#fdecea", text: "#c0392b" },
  pending:  { bg: "#fef9e7", text: "#d68910" },
};

const NodeCard = ({ node, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const statusStyle = STATUS_COLORS[node.status] || STATUS_COLORS.pending;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.name}>{node.name}</h4>
        <span style={{ ...styles.statusBadge, background: statusStyle.bg, color: statusStyle.text }}>
          {node.status}
        </span>
      </div>

      {node.description && <p style={styles.description}>{node.description}</p>}

      {node.tags?.length > 0 && (
        <div style={styles.tags}>
          {node.tags.map((tag) => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      <div style={styles.meta}>
        <span>Created by: <strong>{node.createdBy?.name || "N/A"}</strong></span>
        <span>{new Date(node.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Edit and Delete are ADMIN ONLY */}
      {isAdmin ? (
        <div style={styles.actions}>
          <button onClick={() => onEdit(node)} style={styles.editBtn}>Edit</button>
          <button onClick={() => onDelete(node._id)} style={styles.deleteBtn}>Delete</button>
        </div>
      ) : (
        <div style={styles.readonlyNote}>👁 View only — only admins can edit or delete nodes</div>
      )}
    </div>
  );
};

const styles = {
  card:         { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 18, marginBottom: 14 },
  header:       { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  name:         { margin: 0, fontSize: 15, color: "#2c3e50" },
  statusBadge:  { padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 },
  description:  { color: "#666", fontSize: 13, margin: "0 0 10px" },
  tags:         { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tag:          { background: "#eaf0fb", color: "#2980b9", padding: "2px 8px", borderRadius: 10, fontSize: 11 },
  meta:         { display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 12 },
  actions:      { display: "flex", gap: 8 },
  editBtn:      { padding: "5px 14px", background: "#2980b9", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 },
  deleteBtn:    { padding: "5px 14px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13 },
  readonlyNote: { fontSize: 12, color: "#aaa", fontStyle: "italic" },
};

export default NodeCard;
