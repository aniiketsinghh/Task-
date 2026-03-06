import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken]     = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else      localStorage.removeItem("user");
  }, [user]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(credentials);
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed." };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(formData);
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed." };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
