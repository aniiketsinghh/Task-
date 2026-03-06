import { useState, useCallback } from "react";
import { nodesApi } from "../api/nodes.api";


const useNodes = () => {
  const [nodes, setNodes]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const clearError = () => setError(null);

  const fetchNodes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await nodesApi.getAll(params);
      setNodes(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch nodes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createNode = useCallback(async (nodeData) => {
    try {
      const { data } = await nodesApi.create(nodeData);
      setNodes((prev) => [data.data.node, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to create node." };
    }
  }, []);

  const updateNode = useCallback(async (id, nodeData) => {
    try {
      const { data } = await nodesApi.update(id, nodeData);
      setNodes((prev) => prev.map((n) => (n._id === id ? data.data.node : n)));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update node." };
    }
  }, []);

  const deleteNode = useCallback(async (id) => {
    try {
      await nodesApi.remove(id);
      setNodes((prev) => prev.filter((n) => n._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete node." };
    }
  }, []);

  return { nodes, pagination, loading, error, clearError, fetchNodes, createNode, updateNode, deleteNode };
};

export default useNodes;
