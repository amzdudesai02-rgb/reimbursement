import { createContext } from "react";

export type AuthCtx = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

