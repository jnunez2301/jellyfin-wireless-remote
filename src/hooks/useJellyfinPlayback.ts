import { JELLYFIN_ACCESS_TOKEN_KEY } from '@/constants/constants';
import { useJellyfinStore } from '@/stores/useJellyfinStore';
import type { SessionInfoDto } from '@jellyfin/sdk/lib/generated-client/models';
import { useNavigate } from '@tanstack/react-router';

export type PlaybackCommand =
  | "Stop"
  | "Pause"
  | "Unpause"
  | "NextTrack"
  | "PreviousTrack"
  | "Seek"
  | "Rewind"
  | "FastForward"
  | "PlayPause";

export type SessionCommand = 'VolumeDown' | 'VolumeUp' | 'ToggleMute' | 'MoveRight' | 'MoveLeft' | 'TakeScreenshot';

const useJellyfinPlayback = () => {
  const store = useJellyfinStore();
  const navigate = useNavigate();

  function goBackToLogin(serverAddress: string) {
    sessionStorage.clear();
    navigate({
      to: '/server/$serverAddress/sessions',
      params: {
        serverAddress: serverAddress
      }
    });
  }

  async function playback(serverAddress: string, token: string, sessionId: string, command: PlaybackCommand) {
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

    } catch (err) {
      console.error("Failed to use playback:", err);
    }
  }
  async function sessionCommand(serverAddress: string, token: string, sessionId: string, command: SessionCommand) {
    try {
      const res = await fetch(`${serverAddress}Sessions/${sessionId}/Command/${command}`, {
        method: 'POST',
        headers: {
          "X-Emby-Token": token
        }
      });
      if (res.status === 401) {
        goBackToLogin(serverAddress);
        return;
      }
      if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error));
      }
    } catch (err) {
      console.error("Failed to use playback:", err);
    }
  }

  async function getPlaybackSessions(accessToken: string, serverUrl: string) {
    try {
      sessionStorage.setItem(JELLYFIN_ACCESS_TOKEN_KEY, accessToken);
      const res = await fetch(`${serverUrl}Sessions`, {
        headers: { "X-Emby-Token": accessToken }
      });
      if (res.status === 401) {
        goBackToLogin(serverUrl);
        return;
      }
      if (!res.ok) {
        throw new Error('There was a problem trying to fetch this request')
      }
      const sessions = await res.json();
      store.setSessionList(sessions as SessionInfoDto[]);
    } catch (error) {
      console.error(error);
    }
  }
  async function getCurrentSessionInfo(accessToken: string, sessionId: string, serverUrl: string) {
    try {
      const response = await fetch(`${serverUrl}Sessions`, {
        headers: { "X-Emby-Token": accessToken }
      });
      if (response.status === 401) {
        goBackToLogin(serverUrl);
        return null;
      }
      if (!response.ok) {
        throw new Error('There was a problem trying to fetch this request')
      }
      const sessions = await response.json();
      const sessionList = sessions as SessionInfoDto[];
      const currentSession = sessionList.find(s => s.Id == sessionId) as SessionInfoDto
      if (!currentSession) {
        throw new Error("The session you are trying to find does not exists");
      }
      store.setCurrentSession(currentSession);
      return currentSession;
    } catch (error) {
      console.error(error);
    }
  }

  return { playback, getPlaybackSessions, getCurrentSessionInfo, sessionCommand }
}
export default useJellyfinPlayback