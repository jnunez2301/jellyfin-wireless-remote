import { LocalSession } from '@/models/LocalSession';
import { UserSession } from '@/models/UserSession';
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

export type SessionCommand = 'VolumeDown' | 'VolumeUp' | 'ToggleMute' | 'MoveRight' | 'MoveLeft';

const useJellyfinPlayback = () => {
  const store = useJellyfinStore();
  const navigate = useNavigate();
  const sessionProvider = new UserSession(new LocalSession());
  
  function goBackToLogin(serverAddress: string) {
    sessionProvider.clearSession();
    navigate({
      to: '/server/$serverAddress/sessions',
      params: {
        serverAddress: serverAddress
      }
    });
  }

  async function playback(serverAddress: string, sessionId: string, command: PlaybackCommand) {
    try {
      const accessToken = sessionProvider.getSession();
      if (!accessToken) {
        throw new Error("Acces token is not availible, try to log in again")
      }
      const res = await fetch(`${serverAddress}Sessions/${sessionId}/Playing/${command}`, {
        method: 'POST',
        headers: {
          "X-Emby-Token": accessToken
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
  async function sessionCommand(serverAddress: string, sessionId: string, command: SessionCommand) {
    try {
      const accessToken = sessionProvider.getSession();
      if (!accessToken) {
        throw new Error("Acces token is not availible, try to log in again")
      }
      const res = await fetch(`${serverAddress}Sessions/${sessionId}/Command/${command}`, {
        method: 'POST',
        headers: {
          "X-Emby-Token": accessToken
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

  async function getPlaybackSessions(serverUrl: string) {
    try {
      const accessToken = sessionProvider.getSession();
      if (!accessToken) {
        throw new Error("Acces token is not availible, try to log in again")
      }

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
  async function getCurrentSessionInfo(sessionId: string, serverUrl: string) {
    try {
      const accessToken = sessionProvider.getSession();
      if (!accessToken) {
        throw new Error("Acces token is not availible, try to log in again")
      }
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