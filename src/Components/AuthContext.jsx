import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // App load hote hi localStorage check karo - agar pehle se login hai to state set kar do
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return {
      id: localStorage.getItem("userId"),
      email: localStorage.getItem("userEmail"),
      role: localStorage.getItem("role"),
    };
  });

  // Login.jsx isko call karega successful login k baad
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userEmail", userData.email);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("vendorRegistered");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);