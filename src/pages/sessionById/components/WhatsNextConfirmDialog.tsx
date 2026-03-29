import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import ConfirmPlayDialog from "./ConfirmPlayDialog";

interface WhatsNextConfirmDialogProps {
  item: BaseItemDto | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const WhatsNextConfirmDialog = ({ item, onClose, onConfirm, loading }: WhatsNextConfirmDialogProps) => {
  return (
    <ConfirmPlayDialog
      title="Play next?"
      item={item}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
    />
  );
};

export default WhatsNextConfirmDialog;
