import { getEpisodeLabel, getThumbnailUrl } from "@/helpers/mediaItem";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Flex, Text } from "@chakra-ui/react";
import { LuTv } from "react-icons/lu";

interface WhatsNextCardProps {
  serverAddress: string;
  item: BaseItemDto;
  onClick: () => void;
}

const WhatsNextCard = ({ serverAddress, item, onClick }: WhatsNextCardProps) => {
  const { title, subtitle } = getEpisodeLabel(item);
  const thumbnail = getThumbnailUrl(serverAddress, item);

  return (
    <Flex
      direction="column"
      gap="1"
      flexShrink={0}
      w="120px"
      cursor="pointer"
      onClick={onClick}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          style={{ width: 120, height: 68, objectFit: "cover", borderRadius: "6px" }}
        />
      ) : (
        <Flex w="120px" h="68px" rounded="md" bg="bg.subtle" align="center" justify="center">
          <LuTv />
        </Flex>
      )}
      <Text fontSize="xs" fontWeight="semibold" lineClamp={1}>{title}</Text>
      {subtitle && (
        <Text fontSize="xs" color="fg.muted" lineClamp={1}>{subtitle}</Text>
      )}
    </Flex>
  );
};

export default WhatsNextCard;
