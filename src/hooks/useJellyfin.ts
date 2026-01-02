import { useJellyfinStore } from '@/stores/useJellyfinStore';
import { Api, Jellyfin, type RecommendedServerInfo } from '@jellyfin/sdk';
import { useEffect } from 'react';

const INITIAL_CLIENT_INFO = {
  clientInfo: {
    name: 'My Client Application',
    version: '1.0.0'
  },
  deviceInfo: {
    name: 'Device Name',
    id: 'unique-device-id'
  }
}

const useJellyfin = () => {
  const store = useJellyfinStore();

  async function getServers(host: string) {
    try {
      if (!host) {
        store.setServerList(null);
        return;
      }
      const jellyfin = new Jellyfin(INITIAL_CLIENT_INFO);
      const servers: Array<RecommendedServerInfo> = await jellyfin.discovery.getRecommendedServerCandidates(host);
      // Only display working servers
      store.setServerList(servers.filter(s => s.score >= 0));
    } catch (error) {
      console.error(error);
      store.setServerList(null);
    }
  }

  async function getApi(serverAddress: string) {
    try {
      const jellyfin = new Jellyfin(INITIAL_CLIENT_INFO);
      const api: Api = jellyfin.createApi(serverAddress);
      store.setApi(api);
    } catch (error) {
      console.error(error);
    }
  }
    
  useEffect(() => {
    // Cleanup
    return () => {
      store.setServerList(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { getServers, getApi }
}

export default useJellyfin;