import { getHeaders } from "@/utils/api/getHeaders";
import type {
  BaseItemDtoQueryResult
} from '@jellyfin/sdk/lib/generated-client/models';
import axios from "axios";

interface useJellyfinMediaManagerProps {
  serverAddress: string;
  userId: string;
}

const useJellyfinMediaManager = ({ serverAddress, userId }: useJellyfinMediaManagerProps) => {

  async function getLibraries() {
    try {
      const response = await axios.get(`${serverAddress}Users/${userId}/Views`, {
        headers: {
          ...getHeaders()
        }
      });
      if (response.status == 200) {
        const data = response.data as BaseItemDtoQueryResult;
        const movies = data.Items?.filter(item => item.Type == 'Movie');
        const series = data.Items?.filter(item => item.Type == 'Series');
        // This is just a sample code later on i will replace this with the right logic
        console.log({ movies, series });
      }
    } catch (error) {
      console.error(error);
    }
  }
  return { getLibraries }
};

export default useJellyfinMediaManager;
