
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

// Wraps over React-router routes to for auth
interface ProtectedRouteProps {
  allowedRoles: Exclude<Role, "guest">[];
  children: React.ReactElement;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // not logged in → send to login
    return <Navigate to="/any/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // logged in but wrong role
    return <Navigate to="/any/home" replace />;
  }

  return children;
}

