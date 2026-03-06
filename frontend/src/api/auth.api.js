import apiClient from "./client";

export const authApi = {
  register: (data) => apiClient.post("/auth/register", data),
  login:    (data) => apiClient.post("/auth/login", data),
  getMe:    ()     => apiClient.get("/auth/me"),
};
