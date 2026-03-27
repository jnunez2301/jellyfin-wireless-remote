import { JELLYFIN_RECENT_SERVERS_KEY } from "@/constants/constants";

const MAX_RECENT_SERVERS = 3;

export interface RecentServerEntry {
  url: string;
  addedAt: number; // Unix timestamp ms
}
// Class made to retrieve the most recent servers that the users have used
export class RecentServers {
  getServers(): RecentServerEntry[] {
    try {
      const raw = localStorage.getItem(JELLYFIN_RECENT_SERVERS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as RecentServerEntry[];
      // Sort most recently added first
      return parsed.sort((a, b) => b.addedAt - a.addedAt);
    } catch {
      return [];
    }
  }

  addServer(url: string): void {
    // Remove existing entry for this URL (dedup), then prepend with fresh timestamp
    const existing = this.getServers().filter((s) => s.url !== url);
    const entry: RecentServerEntry = { url, addedAt: Date.now() };
    // If at limit, drop the oldest (last after sort)
    const capped = [entry, ...existing].slice(0, MAX_RECENT_SERVERS);
    localStorage.setItem(JELLYFIN_RECENT_SERVERS_KEY, JSON.stringify(capped));
  }

  removeServer(url: string): void {
    const updated = this.getServers().filter((s) => s.url !== url);
    localStorage.setItem(JELLYFIN_RECENT_SERVERS_KEY, JSON.stringify(updated));
  }

  clear(): void {
    localStorage.removeItem(JELLYFIN_RECENT_SERVERS_KEY);
  }
}
