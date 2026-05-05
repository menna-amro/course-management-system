import { createContext, useContext, useMemo, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setRole(data.role);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setRole(null);
  };

  const register = async (formData) => {
    return await authService.register(formData);
  };

  const value = useMemo(
    () => ({
      role,
      isAuthenticated: Boolean(role),
      login,
      logout,
      register
    }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}