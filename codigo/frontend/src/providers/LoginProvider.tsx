import { useMemo, useState } from "react";
import { LoginContext, type AuthIntent } from "../contexts/loginContext";

export function LoginProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login  = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [intent, setIntent] = useState<AuthIntent>(null);
  const openLogin  = (i: Exclude<AuthIntent, null>) => { setIntent(i); setLoginModalOpen(true); };
  const closeLogin = () => { setLoginModalOpen(false); setIntent(null); };

  
  const obj = useMemo(() => ({ isLoggedIn, setIsLoggedIn, login, logout, loginModalOpen, intent, openLogin, closeLogin }), [isLoggedIn, loginModalOpen, intent]);

  return (
    <LoginContext.Provider value={obj}>
      {children}
    </LoginContext.Provider>
  );
}