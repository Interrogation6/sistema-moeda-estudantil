import { useCallback, useEffect, useMemo, useState } from "react";
import { LoginContext, type AuthIntent } from "../contexts/loginContext";
import type { LoginResponse } from "../contexts/loginContext";

export function LoginProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback((data: LoginResponse) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  }, []);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [intent, setIntent] = useState<AuthIntent>(null);
  const openLogin  = (i: Exclude<AuthIntent, null>) => { setIntent(i); setLoginModalOpen(true); };
  const closeLogin = () => { setLoginModalOpen(false); setIntent(null); };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved))
      setIsLoggedIn(true);
    };
  }, []);


  const displayName = useMemo(() => {
    const nome: string = user?.nome ?? "";
    return nome.split(" ")[0].slice(0, 8);
  }, [user]);
  
  const obj = useMemo(() => ({
    user, isLoggedIn, setIsLoggedIn, displayName, login, logout, loginModalOpen, intent, openLogin, closeLogin
  }), [user, isLoggedIn, displayName, login, loginModalOpen, intent]);

  return (
    <LoginContext.Provider value={obj}>
      {children}
    </LoginContext.Provider>
  );
}