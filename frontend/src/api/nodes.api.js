import apiClient from "./client";

export const nodesApi = {
  getAll:  (params) => apiClient.get("/nodes", { params }),
  getOne:  (id)     => apiClient.get(`/nodes/${id}`),
  create:  (data)   => apiClient.post("/nodes", data),
  update:  (id, data) => apiClient.patch(`/nodes/${id}`, data),
  remove:  (id)     => apiClient.delete(`/nodes/${id}`),
};
