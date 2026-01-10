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

  //  -------- Start of [AI Content] may contain some alucination --------
  /**
 * Get all seasons for a TV series
 * @param seriesId - The ID of the TV series
 * @returns Promise with axios response containing seasons
 */
  async function getSeasons(seriesId: string) {
    try {
      const response = await axios.get(`${serverAddress}Shows/${seriesId}/Seasons`, {
        headers: { ...getHeaders() }
      });

      if (response.status !== 200) {
        throw new Error("There was a problem trying to get list of seasons");
      }

      const data = response.data as BaseItemDtoQueryResult;
      return (data.Items as BaseItemDto[]) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Get all episodes for a specific season
   * @param seasonId - The ID of the season
   * @returns Promise with axios response containing episodes
   */
  async function getSeasonEpisodes(seasonId: string) {
    try {
      const response = await axios.get(`${serverAddress}Items?ParentId=${seasonId}&Fields=Overview`, {
        headers: { ...getHeaders() }
      });

      if (response.status !== 200) {
        throw new Error("There was a problem trying to get list of episodes");
      }

      const data = response.data as BaseItemDtoQueryResult;
      return (data.Items as BaseItemDto[]) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  //  -------- End of [AI Content] may contain some alucination --------
  useEffect(() => {
    return () => {
      libraryStore.clearLibrary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAddress])
  return { getLibraries, getEpisodes, playMedia, getSeasons, getSeasonEpisodes }
};

export default useJellyfinMediaManager;
