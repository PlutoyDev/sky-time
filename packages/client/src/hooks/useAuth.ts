import { useCallback, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export function useAuth() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const logout = useCallback(() => {
    auth.setAccessToken?.(undefined);
    router.push("/api/auth/logout");
  }, []);

  return {
    ...auth,
    logout,
  };
}
