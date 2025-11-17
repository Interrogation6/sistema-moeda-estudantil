import { createContext } from "react";

export type AuthIntent = 'signin' | 'signup' | null;

export type LoginContextType = {
  user: LoginResponse | null;
  setUser: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
  isLoggedIn: boolean;
  // indica que o provider já carregou/validou o estado do login
  hydrated: boolean;
  displayName: string;
  tipo: string;
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
  tipo: string;
  saldo: number;
  token: string;
};

export const LoginContext = createContext<LoginContextType | null>(null);