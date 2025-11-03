import { createContext } from "react";

export type AuthIntent = 'signin' | 'signup' | null;

export type LoginContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  login: () => void;
  logout: () => void;

  loginModalOpen: boolean;
  intent: AuthIntent;
  openLogin: (intent: Exclude<AuthIntent, null>) => void;
  closeLogin: () => void;
};

export const LoginContext = createContext<LoginContextType | null>(null);