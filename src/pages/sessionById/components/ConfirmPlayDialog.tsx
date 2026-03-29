import { getEpisodeLabel } from "@/helpers/mediaItem";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";

interface ConfirmPlayDialogProps {
  title: string;
  item: BaseItemDto | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmPlayDialogBody = ({ item }: { item: BaseItemDto }) => {
  const { title, subtitle } = getEpisodeLabel(item);
  return <Text>{subtitle ? `${title} — ${subtitle}` : title}</Text>;
};

const ConfirmPlayDialog = ({ title, item, onClose, onConfirm, loading }: ConfirmPlayDialogProps) => {
  return (
    <Dialog.Root size="xs" open={item !== null} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              {item && <ConfirmPlayDialogBody item={item} />}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={onConfirm} loading={loading}>Play</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ConfirmPlayDialog;
