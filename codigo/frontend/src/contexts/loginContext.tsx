import { createContext } from "react";

export type LoginContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
};

export const LoginContext = createContext<LoginContextType | null>(null);