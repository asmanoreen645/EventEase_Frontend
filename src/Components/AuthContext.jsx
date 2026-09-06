import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse stored user data", e);
      return null;
    }
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData._id || userData.id);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userName", userData.name);

    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    localStorage.setItem("user", JSON.stringify(newUser));
    if (updatedFields.name) localStorage.setItem("userName", newUser.name);
    if (updatedFields.email) localStorage.setItem("userEmail", newUser.email);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);