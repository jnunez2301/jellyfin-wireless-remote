import { getEpisodeLabel, getThumbnailUrl } from "@/helpers/mediaItem";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Flex, Text } from "@chakra-ui/react";
import { LuHistory } from "react-icons/lu";

interface KeepWatchingItemProps {
  serverAddress: string;
  item: BaseItemDto;
  onSelect: (item: BaseItemDto) => void;
}

const KeepWatchingItem = ({ serverAddress, item, onSelect }: KeepWatchingItemProps) => {
  const { title, subtitle } = getEpisodeLabel(item);
  const thumbnail = getThumbnailUrl(serverAddress, item);
  const seen = item.UserData?.Played ?? false;

  return (
    <Flex
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
      onClick={() => onSelect(item)}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
        />
      ) : (
        <Flex w="72px" h="72px" rounded="sm" bg="bg.subtle" align="center" justify="center" flexShrink={0}>
          <LuHistory />
        </Flex>
      )}
      <Flex direction="column" align="flex-start" flex="1" minW="0">
        <Text fontWeight="semibold" lineClamp={1} textAlign="left">{title}</Text>
        {subtitle && (
          <Text fontSize="sm" color="fg.muted" lineClamp={1} textAlign="left">{subtitle}</Text>
        )}
      </Flex>
    </Flex>
  );
};

export default KeepWatchingItem;
