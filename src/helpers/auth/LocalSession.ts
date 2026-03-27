import { JELLYFIN_ACCESS_TOKEN_KEY } from "@/constants/constants";
import type { iSessionProvider } from "./iSessionProvider";

// LocalSession provider to persist session on  local/session storage
export class LocalSession implements iSessionProvider {

  getSession(): string | null {
    const localSession = localStorage.getItem(JELLYFIN_ACCESS_TOKEN_KEY) || sessionStorage.getItem(JELLYFIN_ACCESS_TOKEN_KEY);
    if (!localSession) {
      return null;
    }
    return localSession;
  }
  setSession(session: string, rememberMe?: boolean): void {
    if (rememberMe) {
      localStorage.setItem(JELLYFIN_ACCESS_TOKEN_KEY, session);
    } else {
      sessionStorage.setItem(JELLYFIN_ACCESS_TOKEN_KEY, session);
    }
  }
  clearSession(): void {
    localStorage.removeItem(JELLYFIN_ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(JELLYFIN_ACCESS_TOKEN_KEY)
  }
}

