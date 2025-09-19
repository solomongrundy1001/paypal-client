// components/routes/AdminRoutes.tsx
import React from "react";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp?: number;
  role?: string;
}

interface AdminRoutesProps {
  children: React.ReactNode;
}

const AdminRoutes: React.FC<AdminRoutesProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (!decoded.exp) return true;
      return decoded.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  };

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/unauthorized" replace />;
  }
  const decoded = jwtDecode<TokenPayload>(token);
  if (decoded.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoutes;
