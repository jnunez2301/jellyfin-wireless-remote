import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useMediaStore from "@/stores/useMediaStore";
import { getEpisodeLabel, getThumbnailUrl } from "@/helpers/mediaItem";
import KeepWatchingSkeleton from "./KeepWatchingSkeleton";
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

  async function handleOpen() {
    setOpen(true);
    await getResumeItems();
  }

  async function handleSelect(itemId: string) {
    setOpen(false);
    await playMedia(sessionId, "PlayNow", itemId);
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
                <Flex direction="column" overflowY="auto" maxH="55dvh">
                  {mediaStore.resumeItems === null ? (
                    <KeepWatchingSkeleton />
                  ) : (
                    <Stack gap="1">
                      {mediaStore.resumeItems.map((item) => {
                        const { title, subtitle } = getEpisodeLabel(item);
                        const thumbnail = getThumbnailUrl(serverAddress, item);
                        const seen = item.UserData?.Played ?? false;
                        return (
                          <Flex
                            key={item.Id}
                            as="button"
                            align="center"
                            gap="3"
                            p="2"
                            rounded="md"
                            w="100%"
                            opacity={seen ? 0.4 : 1}
                            bg={seen ? "bg.subtle" : "transparent"}
                            _hover={{ bg: seen ? "bg.subtle" : "bg.muted" }}
                            cursor="pointer"
                            onClick={() => handleSelect(item.Id!)}
                          >
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                              />
                            ) : (
                              <Flex
                                w="72px"
                                h="72px"
                                rounded="sm"
                                bg="bg.subtle"
                                align="center"
                                justify="center"
                                flexShrink={0}
                              >
                                <LuHistory />
                              </Flex>
                            )}
                            <Flex direction="column" align="flex-start" flex="1" minW="0">
                              <Text fontWeight="semibold" lineClamp={1} textAlign="left">
                                {title}
                              </Text>
                              {subtitle && (
                                <Text fontSize="sm" color="fg.muted" lineClamp={1} textAlign="left">
                                  {subtitle}
                                </Text>
                              )}
                            </Flex>
                          </Flex>
                        );
                      })}
                      {mediaStore.resumeItems.length === 0 && (
                        <Text color="fg.muted" textAlign="center" py="4">
                          There is nothing to continue, try watching something
                        </Text>
                      )}
                    </Stack>
                  )}
                </Flex>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default KeepWatchingSelector;
