// [AI WARNING]
// This component has some features that where done by AI i do not hide the usage of it nor not encourage but we must aknowledge when it's being used
// FIRST OF ALL
// As you can check in the git commit  history this component was mainly written by hand, but there are some features that i didn't do from scrath, which are the followings
// NO IT WAS NOT VIBE CODED I DID REVIEWED THIS CODE AND PROVIDED PROPER INSTRUCTIONS
// * Right side panel for Alphabet filtering
// * Search bar
// * Episode acordion was made 50% from AI, i already had a PoC
import useJellyfinColors from "@/hooks/useJellyfinColors";
import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useMediaStore from "@/stores/useMediaStore";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Skeleton,
  Text,
  VStack
} from "@chakra-ui/react";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { LuArrowLeft, LuChevronDown } from "react-icons/lu";

const Container = ({ children }: { children: ReactNode }) => {
  const params = useParams({ from: '/server/$serverAddress/sessions/$sessionId/library/$libraryId/collectionType/$collectionType' })
  return <Flex direction='column' h='100vh'>
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
  const { getEpisodes, playMedia, getSeasons, getSeasonEpisodes } = useJellyfinMediaManager({ serverAddress: params.serverAddress });
  const colors = useJellyfinColors();
  const mediaStore = useMediaStore();
  const [seriesSeasons, setSeriesSeasons] = useState<Record<string, BaseItemDto[]>>({});
  const [seasonEpisodes, setSeasonEpisodes] = useState<Record<string, BaseItemDto[]>>({});
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  useQuery({
    queryKey: ['jellyfin-media-episodes', params.serverAddress, params.libraryId],
    queryFn: () => getEpisodes(params.libraryId)
  })

  const isTVShows = params.collectionType === 'tvshows';

  // Filter and sort media
  const filteredAndSortedMedia = useMemo(() => {
    if (!mediaStore.mediaList) return [];

    let filtered = mediaStore.mediaList;

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(media =>
        media.Name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply letter filter
    if (selectedLetter) {
      filtered = filtered.filter(media =>
        media.Name?.charAt(0).toUpperCase() === selectedLetter
      );
    }

    // Sort alphabetically
    return [...filtered].sort((a, b) =>
      (a.Name || "").localeCompare(b.Name || "")
    );
  }, [mediaStore.mediaList, searchValue, selectedLetter]);

  // Get unique starting letters
  const availableLetters = useMemo(() => {
    if (!mediaStore.mediaList) return [];
    const letters = new Set(
      mediaStore.mediaList
        .map(media => media.Name?.charAt(0).toUpperCase())
        .filter((letter): letter is string => letter !== undefined && /[A-Z]/.test(letter))
    );
    return Array.from(letters).sort();
  }, [mediaStore.mediaList]);

  if (!mediaStore.mediaList) {
    return <Container>
      <VStack gap={3} px={4}>
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h='65px' w='full' />)}
      </VStack>
    </Container>
  }

  if (mediaStore.mediaList.length === 0) {
    return <Container>
      <Text textAlign='center' my={5} color='fg.muted'>
        Your server doesn't have any media to display
      </Text>
    </Container>
  }

  function handleMediaClick(
    itemId: string | undefined,
    itemName: string | undefined,
    seasonNumber?: number,
    episodeNumber?: number
  ) {
    if (!itemId) return;

    let confirmMessage = '';
    if (seasonNumber !== undefined && episodeNumber !== undefined) {
      confirmMessage = `Do you want to play "${itemName || 'Unknown'}" Season ${seasonNumber} Episode ${episodeNumber}?`;
    } else {
      confirmMessage = `Do you want to play "${itemName || 'Unknown'}"?`;
    }

    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      playMedia(params.sessionId, 'PlayNow', itemId);
    }
  }

  async function handleSeriesExpand(seriesId: string | undefined) {
    if (!seriesId || seriesSeasons[seriesId]) return;
    const seasons = await getSeasons(seriesId);
    setSeriesSeasons(prev => ({ ...prev, [seriesId]: seasons }));
  }

  async function handleSeasonExpand(seriesId: string | undefined, seasonId: string | undefined) {
    if (!seriesId || !seasonId) return;
    const key = `${seriesId}-${seasonId}`;
    if (seasonEpisodes[key]) return;
    const episodes = await getSeasonEpisodes(seasonId);
    setSeasonEpisodes(prev => ({ ...prev, [key]: episodes }));
  }

  if (isTVShows) {
    return <Container data-testid='JellyfinSeries'>
      <Flex flex={1} overflow='hidden'>
        <VStack flex={1} overflow='auto' gap={0} px={4}>
          <Box w='full' py={3} position='sticky' top={0} bg='bg' zIndex={10}>
            <Input
              placeholder='Search series...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Box>

          {filteredAndSortedMedia.length === 0 ? (
            <Text textAlign='center' my={5} color='fg.muted'>
              No series found
            </Text>
          ) : (
            <AccordionRoot collapsible multiple w='full'>
              {filteredAndSortedMedia.map((series) => (
                <AccordionItem key={series.Id} value={series.Id || ''}>
                  <AccordionItemTrigger
                    onClick={() => handleSeriesExpand(series.Id)}
                    cursor='pointer'
                  >
                    <Flex
                      flex={1}
                      gap={3}
                      direction={{ base: 'column', md: 'row' }}
                      align={{ base: 'start', md: 'center' }}
                    >
                      <Image
                        aspectRatio={2 / 3}
                        h={{ base: '200px', md: '80px' }}
                        w={{ base: 'full', md: 'auto' }}
                        fit='contain'
                        src={
                          series.ImageTags?.Primary
                            ? `${params.serverAddress}Items/${series.Id}/Images/Primary?tag=${series.ImageTags.Primary}&maxHeight=300`
                            : "/logo.png"
                        }
                        alt={`Poster for ${series.Name || 'Unknown'}`}
                      />
                      <VStack align='start' gap={0} w='full'>
                        <Text fontWeight='bold'>{series.Name}</Text>
                        <Text color='fg.muted' fontSize='sm'>
                          {series.ProductionYear}
                        </Text>
                      </VStack>
                    </Flex>
                    <AccordionItemIndicator>
                      <LuChevronDown />
                    </AccordionItemIndicator>
                  </AccordionItemTrigger>
                  <AccordionItemContent>
                    {seriesSeasons[series.Id || ''] ? (
                      <AccordionRoot collapsible multiple>
                        {seriesSeasons[series.Id || ''].map((season) => (
                          <AccordionItem key={season.Id} value={season.Id || ''}>
                            <AccordionItemTrigger
                              onClick={() => handleSeasonExpand(series.Id, season.Id)}
                              cursor='pointer'
                            >
                              <HStack flex={1} gap={3}>
                                <Text fontWeight='semibold'>{season.Name}</Text>
                                <Text color='fg.muted' fontSize='sm'>
                                  {season.ChildCount} episodes
                                </Text>
                              </HStack>
                              <AccordionItemIndicator>
                                <LuChevronDown />
                              </AccordionItemIndicator>
                            </AccordionItemTrigger>
                            <AccordionItemContent>
                              {seasonEpisodes[`${series.Id}-${season.Id}`] ? (
                                <VStack gap={2} align='stretch'>
                                  {seasonEpisodes[`${series.Id}-${season.Id}`].map((episode) => (
                                    <Flex
                                      key={episode.Id}
                                      py={2}
                                      px={2}
                                      _hover={{ bg: colors.bg }}
                                      cursor='pointer'
                                      transition='all .2s ease-in-out'
                                      onClick={() => handleMediaClick(
                                        episode.Id,
                                        series.Name as string,
                                        season.IndexNumber as number,
                                        episode.IndexNumber as number
                                      )}
                                      gap={3}
                                      borderRadius='md'
                                      direction={{ base: 'column', md: 'row' }}
                                    >
                                      <Image
                                        aspectRatio={16 / 9}
                                        w={{ base: 'full', md: '160px' }}
                                        fit='cover'
                                        src={
                                          episode.ImageTags?.Primary
                                            ? `${params.serverAddress}Items/${episode.Id}/Images/Primary?tag=${episode.ImageTags.Primary}&maxHeight=200`
                                            : "/logo.png"
                                        }
                                        alt={`Thumbnail for ${episode.Name || 'Unknown'}`}
                                      />
                                      <VStack align='start' gap={1} w='full'>
                                        <Text fontWeight='semibold' fontSize='sm'>
                                          {episode.IndexNumber}. {episode.Name}
                                        </Text>
                                        <Text color='fg.muted' fontSize='xs' lineClamp={2}>
                                          {episode.Overview || "No description available"}
                                        </Text>
                                      </VStack>
                                    </Flex>
                                  ))}
                                </VStack>
                              ) : (
                                <Skeleton h='50px' />
                              )}
                            </AccordionItemContent>
                          </AccordionItem>
                        ))}
                      </AccordionRoot>
                    ) : (
                      <Skeleton h='50px' />
                    )}
                  </AccordionItemContent>
                </AccordionItem>
              ))}
            </AccordionRoot>
          )}
        </VStack>

        {/* Letter sidebar */}
        <VStack
          w={{ base: '50px', md: '40px' }}
          py={4}
          gap={0.5}
          borderLeftWidth='1px'
          overflow='auto'
          flexShrink={0}
        >
          <Box
            as='button'
            fontSize={{ base: 'sm', md: 'xs' }}
            fontWeight={selectedLetter === null ? 'bold' : 'normal'}
            color={selectedLetter === null ? 'blue.500' : 'fg.muted'}
            onClick={() => setSelectedLetter(null)}
            _hover={{ color: 'blue.500' }}
            transition='color 0.2s'
          >
            All
          </Box>
          {availableLetters.map(letter => (
            <Box
              key={letter}
              as='button'
              fontSize={{ base: 'sm', md: 'xs' }}
              fontWeight={selectedLetter === letter ? 'bold' : 'normal'}
              color={selectedLetter === letter ? 'blue.500' : 'fg.muted'}
              onClick={() => setSelectedLetter(letter)}
              _hover={{ color: 'blue.500' }}
              transition='color 0.2s'
            >
              {letter}
            </Box>
          ))}
        </VStack>
      </Flex>
    </Container>;
  }

  // Movies view
  return <Container data-testid='JellyfinEpisodes'>
    <Flex flex={1} overflow='hidden'>
      <VStack flex={1} overflow='auto' gap={0} px={4}>
        <Box w='full' py={3} position='sticky' top={0} bg='bg' zIndex={10}>
          <Input
            placeholder='Search movies...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Box>

        {filteredAndSortedMedia.length === 0 ? (
          <Text textAlign='center' my={5} color='fg.muted'>
            No movies found
          </Text>
        ) : (
          <VStack gap={3} w='full'>
            {filteredAndSortedMedia.map((media) =>
              <Flex
                key={media.Id}
                py={3}
                _hover={{ bg: colors.bg }}
                w='full'
                cursor='pointer'
                transition='all .2s ease-in-out'
                onClick={() => handleMediaClick(media.Id, media.Name as string)}
                borderRadius='md'
                gap={3}
                direction={{ base: 'column', md: 'row' }}
              >
                <Image
                  aspectRatio={16 / 9}
                  w={{ base: 'full', md: '310px' }}
                  fit='contain'
                  src={
                    media.ImageTags?.Primary
                      ? `${params.serverAddress}Items/${media.Id}/Images/Primary?tag=${media.ImageTags.Primary}&maxHeight=500`
                      : "/logo.png"
                  }
                  alt={`Image for media: ${media.Name || 'Unknown'}`}
                />
                <VStack align='start' gap={1} w='full'>
                  <Text fontWeight='bold'>{media.Name}</Text>
                  <Text color='fg.muted'>{media.Overview || "No description available"}</Text>
                </VStack>
              </Flex>
            )}
          </VStack>
        )}
      </VStack>

      {/* Letter sidebar */}
      <VStack
        w={{ base: '50px', md: '40px' }}
        py={4}
        gap={0.5}
        borderLeftWidth='1px'
        overflow='auto'
        flexShrink={0}
      >
        <Box
          as='button'
          fontSize={{ base: 'sm', md: 'xs' }}
          fontWeight={selectedLetter === null ? 'bold' : 'normal'}
          color={selectedLetter === null ? 'blue.500' : 'fg.muted'}
          onClick={() => setSelectedLetter(null)}
          _hover={{ color: 'blue.500' }}
          transition='color 0.2s'
        >
          All
        </Box>
        {availableLetters.map(letter => (
          <Box
            key={letter}
            as='button'
            fontSize={{ base: 'sm', md: 'xs' }}
            fontWeight={selectedLetter === letter ? 'bold' : 'normal'}
            color={selectedLetter === letter ? 'blue.500' : 'fg.muted'}
            onClick={() => setSelectedLetter(letter)}
            _hover={{ color: 'blue.500' }}
            transition='color 0.2s'
          >
            {letter}
          </Box>
        ))}
      </VStack>
    </Flex>
  </Container>;
};

export default JellyfinMediaByLibraryId;