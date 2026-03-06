import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPage";
import DashboardPage  from "./pages/DashboardPage";
import NodesPage      from "./pages/NodesPage";
import AdminUsersPage from "./pages/AdminUsersPage";


const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/nodes"     element={<NodesPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
