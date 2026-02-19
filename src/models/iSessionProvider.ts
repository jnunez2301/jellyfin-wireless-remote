export interface iSessionProvider {
  getSession: () => string | null;
  setSession: (session: string, rememberMe?: boolean) => void;
  clearSession: () => void;
}