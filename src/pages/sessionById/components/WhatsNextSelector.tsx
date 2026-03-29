import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useMediaStore from "@/stores/useMediaStore";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Flex, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import WhatsNextCard from "./WhatsNextCard";
import WhatsNextConfirmDialog from "./WhatsNextConfirmDialog";

interface WhatsNextSelectorProps {
  serverAddress: string;
  sessionId: string;
}

const WhatsNextSelector = ({ serverAddress, sessionId }: WhatsNextSelectorProps) => {
  const { getNextUp, playMedia } = useJellyfinMediaManager({ serverAddress });
  const [loading, setLoading] = useState(false);
  const nextEpisodes = useMediaStore((s) => s.nextEpisodes);
  const setNextEpisodes = useMediaStore((s) => s.setNextEpisodes);
  const [confirmItem, setConfirmItem] = useState<BaseItemDto | null>(null);

  useEffect(() => {
    getNextUp();
    return () => {
      setNextEpisodes(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      setConfirmItem(null);
    };
  }, []);

  if (nextEpisodes === null) {
    return <Flex gap='1'>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} w="120px" h="90px" rounded="md" flexShrink={0} />
      ))}
    </Flex>
  };

  async function handleConfirm() {
    if (!confirmItem?.Id) return;
    setLoading(true);
    try {
      await playMedia(sessionId, "PlayNow", confirmItem.Id);
      setConfirmItem(null);
    } catch (error) {
      console.error("Failed to play media:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Flex direction="column" gap="1" w="100%" mt='2'>
        <Text fontSize="sm" color="fg.muted" fontWeight="medium">Watch next</Text>
        <Flex overflowX="auto" gap="2" pb="1">
          {nextEpisodes.length > 0 ? nextEpisodes?.map((item) => (
            <WhatsNextCard
              key={item.Id}
              serverAddress={serverAddress}
              item={item}
              onClick={() => setConfirmItem(item)}
            />
          )) : <Text color='fg.muted' fontSize='xs'>No suggestions available</Text>}
        </Flex>
      </Flex>

      <WhatsNextConfirmDialog
        item={confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
};

export default WhatsNextSelector;
