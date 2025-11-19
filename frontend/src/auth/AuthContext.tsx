import { useMemo, useState } from "react";
import { AuthContext } from "./context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  const login = (next: string) => {
    setToken(next);
    localStorage.setItem("token", next);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = useMemo(() => ({ token, login, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}