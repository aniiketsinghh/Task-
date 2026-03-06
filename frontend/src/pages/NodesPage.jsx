import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/common/Navbar";
import NodeForm from "../components/nodes/NodeForm";
import NodeCard from "../components/nodes/NodeCard";
import useNodes from "../hooks/useNodes";
import { useAuth } from "../context/AuthContext";

const NodesPage = () => {
  const { isAdmin } = useAuth();
  const { nodes, pagination, loading, error, fetchNodes, createNode, updateNode, deleteNode } = useNodes();

  const [showForm, setShowForm]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null); // admin: node being edited
  const [formLoading, setFormLoading] = useState(false);
  const [feedback, setFeedback]       = useState(null);
  const [filters, setFilters]         = useState({ page: 1, status: "", search: "" });

  const loadNodes = useCallback(() => {
    const params = { page: filters.page, limit: 8 };
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    fetchNodes(params);
  }, [filters, fetchNodes]);

  useEffect(() => { loadNodes(); }, [loadNodes]);

  const notify = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Any user can create
  const handleCreate = async (data) => {
    setFormLoading(true);
    const result = await createNode(data);
    setFormLoading(false);
    if (result.success) { setShowForm(false); notify("success", "Node created successfully."); }
    return result;
  };

  // Admin only
  const handleUpdate = async (data) => {
    setFormLoading(true);
    const result = await updateNode(editTarget._id, data);
    setFormLoading(false);
    if (result.success) { setEditTarget(null); notify("success", "Node updated successfully."); }
    return result;
  };

  // Admin only
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this node?")) return;
    const result = await deleteNode(id);
    if (result.success) notify("success", "Node deleted.");
    else notify("error", result.message);
  };

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>

          <div style={styles.pageHeader}>
            <div>
              <h2 style={styles.heading}>Node Management</h2>
              <p style={styles.sub}>
                {isAdmin
                  ? "Admin view — you can create, edit, and delete nodes."
                  : "You can create nodes. Only admins can edit or delete."}
              </p>
            </div>
            {/* All users can create a node */}
            {!showForm && !editTarget && (
              <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ New Node</button>
            )}
          </div>

          {feedback && (
            <div style={{ ...styles.toast, background: feedback.type === "success" ? "#d5f5e3" : "#fdecea", color: feedback.type === "success" ? "#1e8449" : "#c0392b" }}>
              {feedback.message}
            </div>
          )}

          {error && <div style={styles.errorBanner}>{error}</div>}

          {/* Create form — available to all */}
          {showForm && (
            <NodeForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={formLoading} />
          )}

          {/* Edit form — admin only (NodeCard only calls onEdit if isAdmin) */}
          {editTarget && isAdmin && (
            <NodeForm initialData={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} loading={formLoading} />
          )}

          <div style={styles.filters}>
            <input
              name="search"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={handleFilterChange}
              style={styles.searchInput}
            />
            <select name="status" value={filters.status} onChange={handleFilterChange} style={styles.select}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {loading ? (
            <p style={styles.empty}>Loading nodes...</p>
          ) : nodes.length === 0 ? (
            <p style={styles.empty}>No nodes found. Try creating one.</p>
          ) : (
            nodes.map((node) => (
              <NodeCard
                key={node._id}
                node={node}
                onEdit={setEditTarget}    // NodeCard only renders these buttons if isAdmin
                onDelete={handleDelete}
              />
            ))
          )}

          {pagination && pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button style={styles.pageBtn} disabled={filters.page <= 1} onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}>← Prev</button>
              <span style={styles.pageInfo}>Page {pagination.page} of {pagination.totalPages}</span>
              <button style={styles.pageBtn} disabled={filters.page >= pagination.totalPages} onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  page:        { background: "#f0f2f5", minHeight: "calc(100vh - 52px)", padding: "28px 0" },
  container:   { maxWidth: 800, margin: "0 auto", padding: "0 24px" },
  pageHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  heading:     { margin: "0 0 4px", fontSize: 20, color: "#1a1a2e" },
  sub:         { margin: 0, fontSize: 12, color: "#999" },
  addBtn:      { padding: "8px 18px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, whiteSpace: "nowrap" },
  filters:     { display: "flex", gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4, fontSize: 14 },
  select:      { padding: "8px 10px", border: "1px solid #ccc", borderRadius: 4, fontSize: 14 },
  toast:       { padding: "10px 16px", borderRadius: 6, marginBottom: 16, fontSize: 13 },
  errorBanner: { background: "#fdecea", color: "#c0392b", padding: 10, borderRadius: 6, marginBottom: 14, fontSize: 13 },
  empty:       { color: "#999", fontSize: 14 },
  pagination:  { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 20 },
  pageBtn:     { padding: "6px 16px", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", background: "#fff", fontSize: 13 },
  pageInfo:    { fontSize: 13, color: "#666" },
};

export default NodesPage;
