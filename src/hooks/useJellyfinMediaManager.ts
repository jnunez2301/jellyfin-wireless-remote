import useLibraryStore from "@/stores/useLibraryStore";
import { getHeaders } from "@/utils/api/getHeaders";
import type {
  BaseItemDtoQueryResult
} from '@jellyfin/sdk/lib/generated-client/models';
import axios from "axios";
import { useEffect } from "react";

interface useJellyfinMediaManagerProps {
  serverAddress: string;
}

const useJellyfinMediaManager = ({ serverAddress }: useJellyfinMediaManagerProps) => {
  const store = useLibraryStore();
  async function getLibraries(userId: string) {
    try {
      const response = await axios.get(`${serverAddress}Users/${userId}/Views`, {
        headers: {
          ...getHeaders()
        }
      });
      if (response.status == 200) {
        const data = response.data as BaseItemDtoQueryResult;
        // This is just a sample code later on i will replace this with the right logic
        if (data.Items) {
          store.setCurrentLibrary(data.Items)
        }
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    return () => {
      store.clearLibrary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAddress])
  return { getLibraries }
};

export default useJellyfinMediaManager;
