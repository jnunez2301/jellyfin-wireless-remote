import { getHeaders } from '@/helpers/api/getHeaders';
import type { MediaStream } from '@jellyfin/sdk/lib/generated-client/models';
import axios from 'axios';

const useJellyfinSubtitles = () => {
  async function getSubtitleTracks(serverAddress: string, itemId: string): Promise<MediaStream[]> {
    try {
      const response = await axios.get(`${serverAddress}Items/${itemId}`, {
        params: { Fields: 'MediaStreams' },
        headers: { ...getHeaders() },
      });
      const streams: MediaStream[] = response.data?.MediaStreams ?? [];
      return streams.filter((s) => s.Type === 'Subtitle');
    } catch (error) {
      console.error('Failed to get subtitle tracks:', error);
      return [];
    }
  }

  async function setSubtitleTrack(serverAddress: string, sessionId: string, subtitleIndex: number) {
    try {
      await axios.post(
        `${serverAddress}Sessions/${sessionId}/Command`,
        {
          Name: 'SetSubtitleStreamIndex',
          Arguments: { Index: String(subtitleIndex) },
        },
        { headers: { ...getHeaders() } }
      );
    } catch (error) {
      console.error('Failed to set subtitle track:', error);
    }
  }

  return { getSubtitleTracks, setSubtitleTrack };
};

export default useJellyfinSubtitles;
