import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useMediaStore from "@/stores/useMediaStore";
import KeepWatchingSkeleton from "./KeepWatchingSkeleton";
import KeepWatchingItem from "./KeepWatchingItem";
import ConfirmPlayDialog from "./ConfirmPlayDialog";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import {
  CloseButton,
  Dialog,
  Flex,
  IconButton,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuHistory } from "react-icons/lu";

interface KeepWatchingSelectorProps {
  serverAddress: string;
  sessionId: string;
}


const KeepWatchingSelector = ({ serverAddress, sessionId }: KeepWatchingSelectorProps) => {
  const { getResumeItems, playMedia } = useJellyfinMediaManager({ serverAddress });
  const mediaStore = useMediaStore();
  const [open, setOpen] = useState(false);
  const [confirmItem, setConfirmItem] = useState<BaseItemDto | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    setOpen(true);
    await getResumeItems();
  }

  function handleSelect(item: BaseItemDto) {
    setConfirmItem(item);
  }

  async function handleConfirm() {
    if (!confirmItem?.Id) return;
    const itemId = confirmItem.Id;
    setLoading(true);
    try {
      await playMedia(sessionId, "PlayNow", itemId);
      setConfirmItem(null);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      mediaStore.setResumeItems(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <IconButton variant="ghost" p="3" onClick={handleOpen}>
        <LuHistory />
        Keep Watching
      </IconButton>

      <Dialog.Root size="xs" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Keep Watching</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body pb="4">
                {mediaStore.resumeItems === null ? (
                  <KeepWatchingSkeleton />
                ) : (
                  <Flex direction="column" overflowY="auto" maxH="55dvh">
                    <Stack gap="1">
                      {mediaStore.resumeItems.map((item) => (
                        <KeepWatchingItem
                          key={item.Id}
                          serverAddress={serverAddress}
                          item={item}
                          onSelect={handleSelect}
                        />
                      ))}
                      {mediaStore.resumeItems.length === 0 && (
                        <Text color="fg.muted" textAlign="center" py="4">
                          There is nothing to continue, try watching something
                        </Text>
                      )}
                    </Stack>
                  </Flex>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <ConfirmPlayDialog
        title="Resume playback?"
        item={confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
};

export default KeepWatchingSelector;
