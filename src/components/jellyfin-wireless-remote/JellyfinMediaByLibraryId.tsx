import useJellyfinColors from "@/hooks/useJellyfinColors";
import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useMediaStore from "@/stores/useMediaStore";
import { Box, Flex, IconButton, Image, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";


const Container = ({ children }: { children: ReactNode }) => {
  const params = useParams({ from: '/server/$serverAddress/sessions/$sessionId/library/$libraryId/collectionType/$collectionType' })
  return <Flex direction='column'>
    <Link to="/server/$serverAddress/sessions/$sessionId/library" params={params}>
      <IconButton variant='ghost'>
        <LuArrowLeft />
      </IconButton>
    </Link>
    {children}
  </Flex>
}

const JellyfinMediaByLibraryId = () => {
  const params = useParams({ from: '/server/$serverAddress/sessions/$sessionId/library/$libraryId/collectionType/$collectionType' })
  const { getEpisodes, playMedia } = useJellyfinMediaManager({ serverAddress: params.serverAddress });
  const colors = useJellyfinColors();
  const mediaStore = useMediaStore();

  useQuery({
    queryKey: ['jellyfin-media-episodes', params.serverAddress, params.libraryId],
    queryFn: () => getEpisodes(params.libraryId)
  })
  // mediaStore.mediaList = null
  if (!mediaStore.mediaList) {
    return <Container>
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h='65px' mb='3' />)}
    </Container>
  }
  if (mediaStore.mediaList.length === 0) {
    return <Container><Text textAlign='center' my='5' color='fg.muted'>Your server doesn't have any media to display</Text></Container>
  }
  function handleMediaClick(itemId: string) {
    playMedia(params.sessionId, 'PlayNow', itemId)
  }
  return <Container data-testid='JellyfinEpisodes'>
    {mediaStore.mediaList.map((media) =>
      <Flex
        key={media.Id} py='3'
        _hover={{ backgroundColor: colors.bg }}
        flexWrap='wrap'
        cursor='pointer'
        transition='all .2s ease-in-out'
        onClick={() => handleMediaClick(media.Id as string)}
      >
        <Image
          aspectRatio={16 / 9}
          w="310px"
          fit="contain"
          src={
            media.ImageTags?.Primary
              ? `${params.serverAddress}Items/${media.Id}/Images/Primary?tag=${media.ImageTags['Primary']}&maxHeight=500`
              : "/logo.png"
          }
          alt={`Image for media: ${media.Name}`}
        />
        <Box>
          <Text fontWeight='bold'>{media.Name}</Text>
          <Text color='fg.muted'>{media.Overview || "No description available"}</Text>
        </Box>
        {/* <div>{media.ImageTags['Primary']}</div> */}
      </Flex>
    )}
  </Container>;
};

export default JellyfinMediaByLibraryId;
