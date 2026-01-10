import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { create } from "zustand";

interface LibraryStore {
  currentLibrary: null | BaseItemDto[],
  setCurrentLibrary: (library: BaseItemDto[]) => void,
  clearLibrary: () => void
}

const useLibraryStore = create<LibraryStore>((set) => ({
  currentLibrary: null,
  setCurrentLibrary: (library) => set({ currentLibrary: library }),
  clearLibrary: () => set({ currentLibrary: null })
}))

export default useLibraryStore;