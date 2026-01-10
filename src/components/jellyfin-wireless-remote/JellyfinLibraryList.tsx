import { Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useParams } from "@tanstack/react-router";

const JellyfinLibraryList = ({ library }: { library: BaseItemDto[] | null }) => {
  const { serverAddress } = useParams({ from: '/server/$serverAddress/sessions/$sessionId/library' });
  if (!library) {
    return Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} w='100%' h='100px' />)
  }
  if (library.length === 0) {
    return <Flex justify='center' py='5'>
      <Text color='fg.muted'>You don't have any libraries</Text>
    </Flex>
  }
  return <div data-testid='JellyfinLibraryList'>
    {library.map((lib) => (<Flex key={lib.Id}>
      {/* TODO: Fix image url */}
      <Image aspectRatio={4 / 3} src={`${serverAddress}/Items/${lib.Id}/Images/Primary?tag=${library[0].ImageTags['Primary']}&maxHeight=500`} />
      {/* TODO: Wrap with Link to /library/$libraryId */}
      <Box>
        <Text>{lib.Name}</Text>
      </Box>
    </Flex>))}
  </div>;
};

export default JellyfinLibraryList;
