import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return {
      id: localStorage.getItem("userId"),
      email: localStorage.getItem("userEmail"),
      role: localStorage.getItem("role"),
      name: localStorage.getItem("userName"),
    };
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userName", userData.name);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("vendorRegistered");
    setUser(null);
  };

  // 👇 YE NAYA FUNCTION HAI — ProfileSettings ke save ke baad ye call hota hai
  const updateUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    localStorage.setItem("userName", newUser.name);
    localStorage.setItem("userEmail", newUser.email);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);