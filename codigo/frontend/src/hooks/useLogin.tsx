import { useContext } from "react";
import { LoginContext } from "../contexts/loginContext";

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin deve ser usado dentro de um LoginProvider");
  }
  //console.log('[useLogin]', context.isLoggedIn);
  return context;
}