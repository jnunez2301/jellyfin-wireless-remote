import { JELLYFIN_ACCESS_TOKEN_KEY } from '@/constants/constants';
import { useJellyfinStore } from '@/stores/useJellyfinStore';
import type { SessionInfoDto } from '@jellyfin/sdk/lib/generated-client/models';

export type Command =
  | "Stop"
  | "Pause"
  | "Unpause"
  | "NextTrack"
  | "PreviousTrack"
  | "Seek"
  | "Rewind"
  | "FastForward"
  | "PlayPause";


const useJellyfinPlayback = () => {
  const store = useJellyfinStore();

  async function playback(serverAddress: string,token: string, sessionId: string, command: Command) {
    try {
      const res = await fetch(`${serverAddress}Sessions/${sessionId}/Playing/${command}`, {
        method: 'POST',
        headers: {
          "X-Emby-Token": token
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error));
      }

      console.log("Playback stopped successfully!");
    } catch (err) {
      console.error("Failed to stop playback:", err);
    }
  }
  function persistSession(accessToken: string) {
    sessionStorage.setItem(JELLYFIN_ACCESS_TOKEN_KEY, accessToken);
  }

  async function getPlaybackSessions(accessToken: string, serverUrl: string) {
    try {
      persistSession(accessToken);
      const res = await fetch(`${serverUrl}Sessions`, {
        headers: { "X-Emby-Token": accessToken }
      });
      if (!res.ok) {
        throw new Error('There was a problem trying to fetch this request')
      }
      const sessions = await res.json();
      store.setSessionList(sessions as SessionInfoDto[]);
    } catch (error) {
      console.error(error);
    }
  }

  // Check from sessions and assign to store when session selected
  // * NowPlayingItem  (// what is running)
  // * PlayState
  //   {
  //     "CanSeek": false, //If something is running
  //     "IsPaused": false,
  //     "IsMuted": false,
  //     "RepeatMode": "RepeatNone",
  //     "PlaybackOrder": "Default"
  // }
  return { playback, getPlaybackSessions }
}
export default useJellyfinPlayback