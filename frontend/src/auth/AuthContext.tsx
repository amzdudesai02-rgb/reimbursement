import { useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./context";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

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

  // Clear token when the browser tab/window is closed or refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, []);

  // Automatic logout after a period of inactivity while logged in
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clearTimer = () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const resetTimer = () => {
      clearTimer();
      if (!token) return;
      idleTimerRef.current = window.setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT_MS);
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Track when tab becomes visible again
    document.addEventListener("visibilitychange", resetTimer);

    // Start timer when token is present
    resetTimer();

    return () => {
      clearTimer();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      document.removeEventListener("visibilitychange", resetTimer);
    };
  }, [token]);

  const value = useMemo(() => ({ token, login, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}