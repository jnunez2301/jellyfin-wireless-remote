import { INITIAL_CLIENT_INFO } from '@/constants/constants';
import { useJellyfinStore } from '@/stores/useJellyfinStore';
import { Api, Jellyfin, type RecommendedServerInfo } from '@jellyfin/sdk';
import { useEffect } from 'react';



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
      return servers;
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