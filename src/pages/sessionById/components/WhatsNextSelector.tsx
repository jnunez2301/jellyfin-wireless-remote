import { getEpisodeLabel } from "@/helpers/mediaItem";
import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useMediaStore from "@/stores/useMediaStore";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import WhatsNextCard from "./WhatsNextCard";

interface WhatsNextSelectorProps {
  serverAddress: string;
  sessionId: string;
}

const WhatsNextSelector = ({ serverAddress, sessionId }: WhatsNextSelectorProps) => {
  const { getNextUp, playMedia } = useJellyfinMediaManager({ serverAddress });
  const nextEpisodes = useMediaStore((s) => s.nextEpisodes);
  const setNextEpisodes = useMediaStore((s) => s.setNextEpisodes);
  const [confirmItem, setConfirmItem] = useState<BaseItemDto | null>(null);

  useEffect(() => {
    setNextEpisodes(null);
    getNextUp();
    return () => {
      setNextEpisodes(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (nextEpisodes !== null && nextEpisodes.length === 0) return null;

  async function handleConfirm() {
    if (!confirmItem?.Id) return;
    setConfirmItem(null);
    await playMedia(sessionId, "PlayNow", confirmItem.Id);
  }

  return (
    <>
      <Flex direction="column" gap="1" w="100%">
        <Text fontSize="sm" color="fg.muted" fontWeight="medium">Watch next</Text>
        <Flex overflowX="auto" gap="2" pb="1">
          {nextEpisodes === null && (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} w="120px" h="90px" rounded="md" flexShrink={0} />
            ))
          )}
          {nextEpisodes?.map((item) => (
            <WhatsNextCard
              key={item.Id}
              serverAddress={serverAddress}
              item={item}
              onClick={() => setConfirmItem(item)}
            />
          ))}
        </Flex>
      </Flex>

      <Dialog.Root size="xs" open={!!confirmItem} onOpenChange={(e) => !e.open && setConfirmItem(null)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Play next?</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                {confirmItem && (() => {
                  const { title, subtitle } = getEpisodeLabel(confirmItem);
                  return <Text>{subtitle ? `${title} — ${subtitle}` : title}</Text>;
                })()}
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setConfirmItem(null)}>Cancel</Button>
                <Button onClick={handleConfirm}>Play</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default WhatsNextSelector;
