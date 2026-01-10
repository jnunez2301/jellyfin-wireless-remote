import type {
  BaseItemDto,
} from "@jellyfin/sdk/lib/generated-client/models";
import { create } from "zustand";

interface MediaStore {
  mediaList: null | BaseItemDto[];
  setMediaList: (media: BaseItemDto[]) => void;
  clearMedia: () => void;
}

const useMediaStore = create<MediaStore>((set) => ({
  mediaList: null,
  setMediaList: (media) => set({ mediaList: media }),
  clearMedia: () => set({ mediaList: null }),
}));

export default useMediaStore;
