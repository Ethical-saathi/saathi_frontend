import { useContext } from "react";
import { SessionContext, type SessionContextValue } from "@/context/SessionContext";

export const useSession = (): SessionContextValue => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a <SessionProvider>");
  }
  return ctx;
};
