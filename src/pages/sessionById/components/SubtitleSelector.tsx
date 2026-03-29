import useJellyfinSubtitles from "@/hooks/useJellyfinSubtitles";
import type { MediaStream } from "@jellyfin/sdk/lib/generated-client/models";
import {
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Portal,
  ScrollArea,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuCaptions } from "react-icons/lu";

interface SubtitleSelectorProps {
  serverAddress: string;
  sessionId: string;
  itemId: string;
  currentSubtitleIndex: number;
  onSubtitleChange: () => void;
}

function getActiveLanguage(tracks: MediaStream[], index: number): string {
  if (index === -1) return 'Off';
  const active = tracks.find((t) => t.Index === index);
  if (!active) return 'Off';
  return active.Language ?? 'Off';
}

const SubtitleSelector = ({
  serverAddress,
  sessionId,
  itemId,
  currentSubtitleIndex,
  onSubtitleChange,
}: SubtitleSelectorProps) => {
  const { getSubtitleTracks, setSubtitleTrack } = useJellyfinSubtitles();
  const [open, setOpen] = useState(false);
  const [tracks, setTracks] = useState<MediaStream[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    getSubtitleTracks(serverAddress, itemId).then(setTracks);
    return () => {
      setTracks([]);
      setSelectedIndex(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverAddress, itemId]);

  const activeIndex = selectedIndex ?? currentSubtitleIndex;

  async function handleSelect(index: number) {
    setSelectedIndex(index);
    setOpen(false);
    await setSubtitleTrack(serverAddress, sessionId, index);
    onSubtitleChange();
  }

  return (
    <>
      <IconButton size='xl' variant="subtle" p="3" onClick={() => setOpen(true)}>
        <LuCaptions />
        {getActiveLanguage(tracks, activeIndex)}
      </IconButton>

      <Dialog.Root size="xs" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Subtitles</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <ScrollArea.Root maxH="60dvh" overflowY="auto">
                  <ScrollArea.Viewport>
                    <Stack gap="2">
                      <Button
                        variant={activeIndex === -1 ? "solid" : "ghost"}
                        onClick={() => handleSelect(-1)}
                      >
                        Off
                      </Button>
                      {tracks.map((track) => (
                        <Button
                          key={track.Index}
                          variant={activeIndex === track.Index ? "solid" : "ghost"}
                          w='90%'
                          onClick={() => handleSelect(track.Index!)}
                        >
                          {track.DisplayTitle ?? track.Language ?? `Track ${track.Index}`}
                        </Button>
                      ))}
                      {tracks.length === 0 && (
                        <Text color="fg.muted" textAlign="center">
                          No subtitle tracks available
                        </Text>
                      )}
                    </Stack>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default SubtitleSelector;
