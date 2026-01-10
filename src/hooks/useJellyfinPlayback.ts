import { INITIAL_CLIENT_INFO } from '@/constants/constants';
import { LocalSession } from '@/models/LocalSession';
import { UserSession } from '@/models/UserSession';
import { useJellyfinStore } from '@/stores/useJellyfinStore';
import { getHeaders } from '@/utils/api/getHeaders';
import type { SessionInfoDto } from '@jellyfin/sdk/lib/generated-client/models';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';

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

export type SessionCommand = 'VolumeDown' | 'VolumeUp' | 'ToggleMute' | 'MoveRight' | 'MoveLeft' | 'Mute' | 'UnMute';

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

      const res = await fetch(`${serverAddress}Sessions/${sessionId}/Playing/${command}`, {
        method: 'POST',
        headers: { ...getHeaders() }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error));
      }
      await getCurrentSessionInfo(sessionId, serverAddress)
    } catch (err) {
      console.error("Failed to use playback:", err);
    }
  }
  async function sessionCommand(serverAddress: string, sessionId: string, command: SessionCommand) {
    try {

      const res = await fetch(`${serverAddress}Sessions/${sessionId}/Command/${command}`, {
        method: 'POST',
        headers: { ...getHeaders() }
      });
      if (res.status === 401) {
        goBackToLogin(serverAddress);
        return;
      }
      if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error));
      }
      // Refresh session
      const session = await getCurrentSessionInfo(sessionId, serverAddress)
      return session;
    } catch (err) {
      console.error("Failed to use playback:", err);
    }
  }

  async function getPlaybackSessions(serverUrl: string) {
    try {
      const res = await axios.get(`${serverUrl}Sessions`, {
        headers: { ...getHeaders() }
      });
      if (res.status === 401) {
        goBackToLogin(serverUrl);
        return;
      }
      const sessions = await res.data;

      const sortedSessionsByPlayStatus = (sessions as SessionInfoDto[]).filter(s => s.DeviceId != INITIAL_CLIENT_INFO.deviceInfo.id).sort((sessionA, sessionB) => {
        if (sessionA.NowPlayingItem && !sessionB.NowPlayingItem) return -1;
        if (!sessionA.NowPlayingItem && sessionB.NowPlayingItem) return 1;
        return 0;
      });

      store.setSessionList(sortedSessionsByPlayStatus);

      return res;
    } catch (error) {
      console.error(error);
    }
  }
  async function getCurrentSessionInfo(sessionId: string, serverUrl: string) {
    try {

      const response = await axios.get(`${serverUrl}Sessions`, {
        headers: { ...getHeaders() }
      });
      if (response.status === 401) {
        goBackToLogin(serverUrl);
        return null;
      }
      const sessions = await response.data;
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