import type { iSessionProvider } from "./iSessionProvider";

// Generic session provider
export class UserSession {
  private readonly provider: iSessionProvider;

  constructor(provider: iSessionProvider) {
    this.provider = provider
  }

  getSession(): string | null {
    return this.provider.getSession();
  }

  setSession(session: string, rememberMe?: boolean): void {
    this.provider.setSession(session, rememberMe);
  }

  clearSession(): void {
    this.provider.clearSession();
  }

}
