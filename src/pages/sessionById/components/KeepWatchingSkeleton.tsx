import { Flex, Skeleton, Stack } from "@chakra-ui/react";

const KeepWatchingSkeleton = () => (
  <Stack gap="1">
    {Array.from({ length: 4 }).map((_, i) => (
      <Flex key={i} align="center" gap="3" p="2">
        <Skeleton w="72px" h="72px" rounded="sm" flexShrink={0} />
        <Flex direction="column" gap="2" flex="1">
          <Skeleton h="4" w="60%" />
          <Skeleton h="3" w="40%" />
        </Flex>
      </Flex>
    ))}
  </Stack>
);

export default KeepWatchingSkeleton;
