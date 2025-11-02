import { useMemo, useState } from "react";
import { LoginContext } from "../contexts/loginContext";

export function LoginProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const obj = useMemo(() => ({ isLoggedIn, setIsLoggedIn }), [isLoggedIn]);

  return (
    <LoginContext.Provider value={obj}>
      {children}
    </LoginContext.Provider>
  );
}