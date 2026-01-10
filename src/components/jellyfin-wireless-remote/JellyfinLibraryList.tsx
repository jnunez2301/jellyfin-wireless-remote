import useJellyfinColors from "@/hooks/useJellyfinColors";
import { Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Link, useParams } from "@tanstack/react-router";

const JellyfinLibraryList = ({ library }: { library: BaseItemDto[] | null }) => {
  const params = useParams({ from: '/server/$serverAddress/sessions/$sessionId/library' });
  const colors = useJellyfinColors();
  if (!library) {
    return Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} w='100%' h='100px' />)
  }
  if (library.length === 0) {
    return <Flex justify='center' py='5'>
      <Text color='fg.muted'>You don't have any libraries</Text>
    </Flex>
  }
  return <Flex gap='3' data-testid='JellyfinLibraryList' flexWrap='wrap'>
    {library.map((lib) => (
      <Link key={lib.Id} to='/server/$serverAddress/sessions/$sessionId/library/$libraryId/collectionType/$collectionType' params={{ ...params, libraryId: lib.Id as string, collectionType: lib.CollectionType as string }}>
        <Box p='3' cursor='pointer' transition='all .2s ease-in' backgroundColor={colors.bg} _hover={{
          opacity: .6,
          backgroundColor: colors.hoverBg,
        }}>
          <Image
            aspectRatio={16 / 9}
            w='xs'
            fit='contain'
            src={!lib.ImageTags ? '/logo.png' : `${params.serverAddress}Items/${lib.Id}/Images/Primary?tag=${lib.ImageTags?.Primary}&maxHeight=500`}
            alt={`Image for library: ${lib.Name}`}
          />
          <Text textAlign='center' color='white' fontWeight='bold' my='1'>{lib.Name}</Text>
        </Box>
      </Link>
    ))}
  </Flex>;
};

export default JellyfinLibraryList;
