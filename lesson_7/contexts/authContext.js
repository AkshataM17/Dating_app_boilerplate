// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromToken() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        } catch (error) {
          console.error("Error loading user", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }
    loadUserFromToken();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    router.push("/dashboard");
  };

  const signup = async (name, email, password) => {
    const { data } = await axios.post("/api/auth/signup", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
