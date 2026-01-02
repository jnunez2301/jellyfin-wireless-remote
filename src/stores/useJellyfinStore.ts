import type { Api, RecommendedServerInfo } from "@jellyfin/sdk";
import type { SessionInfoDto } from "@jellyfin/sdk/lib/generated-client/models";
import { create } from "zustand";


interface JellyfinStore {
  serverList: null | Array<RecommendedServerInfo>
  setServerList: (serverList: Array<RecommendedServerInfo> | null) => void;
  api: Api | null;
  setApi: (address: Api | null) => void;
  sessionList: SessionInfoDto[] | null;
  setSessionList: (sessions: SessionInfoDto[]) => void,
  clearSessionList: () => void,
  currentSession: SessionInfoDto | null;
  setCurrentSession: (session: SessionInfoDto) => void;
  clearSession: () => void,
}

export const useJellyfinStore = create<JellyfinStore>((set) => ({
  serverList: null,
  setServerList: (serverList) => set({ serverList: serverList }),
  api: null,
  setApi: (api) => set({ api: api }),
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
  sessionList: null,
  clearSession: () => set({ currentSession: null }),
  setSessionList: (sessions) => set({ sessionList: sessions }),
  clearSessionList: () => set({ sessionList: null })
}));

export const useCurrentSession = () => useJellyfinStore((state) => state.currentSession);