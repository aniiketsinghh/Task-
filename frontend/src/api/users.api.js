import apiClient from "./client";

export const usersApi = {
  getAll:      (params)     => apiClient.get("/users", { params }),
  updateRole:  (id, role)   => apiClient.patch(`/users/${id}/role`, { role }),
  remove:      (id)         => apiClient.delete(`/users/${id}`),
};
