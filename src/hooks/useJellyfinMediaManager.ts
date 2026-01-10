import useLibraryStore from "@/stores/useLibraryStore";
import useMediaStore from "@/stores/useMediaStore";
import { getHeaders } from "@/utils/api/getHeaders";
import type {
  BaseItemDto,
  BaseItemDtoQueryResult
} from '@jellyfin/sdk/lib/generated-client/models';
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useEffect } from "react";

interface useJellyfinMediaManagerProps {
  serverAddress: string;
}

const useJellyfinMediaManager = ({ serverAddress }: useJellyfinMediaManagerProps) => {
  const libraryStore = useLibraryStore();
  const mediaStore = useMediaStore();
  const navigate = useNavigate();
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
          libraryStore.setCurrentLibrary(data.Items)
        }
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getEpisodes(libraryId: string) {
    try {
      const response = await axios.get(`${serverAddress}Items?ParentId=${libraryId}&Recursive=false`, {
        headers: { ...getHeaders() }
      })
      if (response.status != 200) {
        throw new Error("There was a problem trying to get list of seasons and movies");
      }
      const data = response.data as BaseItemDtoQueryResult;
      mediaStore.setMediaList(data.Items as BaseItemDto[])
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async function playMedia(sessionId: string, playCommand: 'PlayNow' | 'PlayNext', itemId: string) {
    try {
      const response = await axios.post(
        `${serverAddress}Sessions/${sessionId}/Playing`,
        null,
        {
          params: {
            playCommand,
            itemIds: itemId,
          },
          headers: {
            ...getHeaders()
          },
        }
      ); 
      if (response.status != 204) {
        throw new Error("There was a problem trying to get list of seasons and movies");
      }
      navigate({
        to: '/server/$serverAddress/sessions/$sessionId',
        params: {
          sessionId: sessionId,
          serverAddress: serverAddress
        }
      })
    } catch (error) {
      console.error(error);
    }

  }
  useEffect(() => {
    return () => {
      libraryStore.clearLibrary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAddress])
  return { getLibraries, getEpisodes, playMedia }
};

export default useJellyfinMediaManager;
