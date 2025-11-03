import { createContext } from "react";

export type AuthIntent = 'signin' | 'signup' | null;

export type LoginContextType = {
  user: LoginResponse | null;
  isLoggedIn: boolean;
  displayName: string;
  setIsLoggedIn: (v: boolean) => void;
  login: (data: LoginResponse) => void;
  logout: () => void;

  loginModalOpen: boolean;
  intent: AuthIntent;
  openLogin: (intent: Exclude<AuthIntent, null>) => void;
  closeLogin: () => void;
};

export type LoginResponse = {
  id: number;
  nome: string;
  email: string;
  saldo: number;
  token: string;
};

export const LoginContext = createContext<LoginContextType | null>(null);