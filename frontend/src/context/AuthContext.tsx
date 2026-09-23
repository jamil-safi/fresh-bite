import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../types";
import { loginRequest, signupRequest, meRequest } from "../api/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("freshbites_token");
    if (!token) {
      setLoading(false);
      return;
    }
    meRequest()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("freshbites_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await loginRequest({ email, password });
    localStorage.setItem("freshbites_token", token);
    setUser(user);
  }

  async function signup(payload: { firstName: string; lastName: string; email: string; password: string }) {
    const { token, user } = await signupRequest(payload);
    localStorage.setItem("freshbites_token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("freshbites_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
