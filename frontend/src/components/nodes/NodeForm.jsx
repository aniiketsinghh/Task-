import React, { useState, useEffect } from "react";

const NodeForm = ({ initialData = null, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
    tags: "",
  });
  const [error, setError] = useState("");

  // Populate form when editing an existing node
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        status: initialData.status || "active",
        tags: (initialData.tags || []).join(", "),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Node name is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const result = await onSubmit(payload);
    if (result?.success === false) setError(result.message);
  };

  const isEditing = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.title}>{isEditing ? "Edit Node" : "Create Node"}</h3>

      {error && <p style={styles.error}>{error}</p>}

      <label style={styles.label}>Name *</label>
      <input name="name" value={form.name} onChange={handleChange} style={styles.input} placeholder="Node name" />

      <label style={styles.label}>Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: 80, resize: "vertical" }} placeholder="Optional description" />

      <label style={styles.label}>Status</label>
      <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>

      <label style={styles.label}>Tags (comma separated)</label>
      <input name="tags" value={form.tags} onChange={handleChange} style={styles.input} placeholder="e.g. api, service, backend" />

      <div style={styles.actions}>
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Saving..." : isEditing ? "Update Node" : "Create Node"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: { background: "#fff", padding: 24, borderRadius: 8, border: "1px solid #ddd", marginBottom: 24 },
  title: { margin: "0 0 16px", fontSize: 16, color: "#333" },
  label: { display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600, color: "#555" },
  input: { width: "100%", padding: "8px 10px", marginBottom: 14, border: "1px solid #ccc", borderRadius: 4, fontSize: 14, boxSizing: "border-box" },
  error: { background: "#fdecea", color: "#c0392b", padding: "8px 12px", borderRadius: 4, marginBottom: 12, fontSize: 13 },
  actions: { display: "flex", gap: 10 },
  submitBtn: { padding: "9px 20px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14 },
  cancelBtn: { padding: "9px 20px", background: "transparent", border: "1px solid #aaa", borderRadius: 4, cursor: "pointer", fontSize: 14 },
};

export default NodeForm;
