import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export function getEpisodeLabel(item: BaseItemDto): { title: string; subtitle: string | null } {
  if (item.SeriesName) {
    const season = item.ParentIndexNumber != null ? `S${item.ParentIndexNumber}` : null;
    const ep = item.IndexNumber != null ? `E${item.IndexNumber}` : null;
    const tag = [season, ep].filter(Boolean).join("");
    return {
      title: item.SeriesName,
      subtitle: tag ? `${tag} · ${item.Name}` : (item.Name ?? null),
    };
  }
  return { title: item.Name ?? "Unknown", subtitle: null };
}

export function getThumbnailUrl(serverAddress: string, item: BaseItemDto): string | null {
  if (!item.ImageTags?.Primary) return null;
  return `${serverAddress}Items/${item.Id}/Images/Primary?fillHeight=72&fillWidth=72&quality=90`;
}
