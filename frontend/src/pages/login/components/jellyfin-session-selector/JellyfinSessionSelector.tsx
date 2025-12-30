import { JELLYFIN_ACCESS_TOKEN_KEY } from "@/constants/constants";
import useJellyfinColors from "@/hooks/useJellyfinColors";
import useJellyfinPlayback from "@/hooks/useJellyfinPlayback";
import { useJellyfinStore } from "@/stores/useJellyfinStore";
import { Badge, Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { SessionInfoDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return <>
    <Heading mb='3'>Sessions List</Heading>
    {children}
  </>
}
const EmptySessionComponent = ({ serverAddress }: { serverAddress: string }) => {
  const colors = useJellyfinColors();
  return <Flex alignItems='center' direction='column'>
    <Text my='3' color='fg.suble'>There is no sessions availible for this user</Text>
    <Button variant='ghost' color={colors.subtitleColor}>
      <Link to='/server/$serverAddress' params={{ serverAddress: serverAddress }}>Go back to login</Link>
    </Button>
  </Flex>
}
const JellyfinSessionSelector = () => {
  const colors = useJellyfinColors();
  const store = useJellyfinStore();
  const { getPlaybackSessions } = useJellyfinPlayback();
  const navigate = useNavigate();
  const { serverAddress } = useParams({
    from: '/server/$serverAddress/sessions',
  })
  useEffect(() => {
    const userSession = sessionStorage.getItem(JELLYFIN_ACCESS_TOKEN_KEY);
    if (userSession) {
      getPlaybackSessions(userSession, serverAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!store.sessionList || (store.sessionList && store.sessionList.length === 0)) {
    return <Header>
      <EmptySessionComponent serverAddress={serverAddress} />
    </Header>
  }
  function handleSessionSelect(session: SessionInfoDto) {
    store.setCurrentSession(session);
    navigate({
      to: '/server/$serverAddress/sessions/$serverId',
      params: {
        serverAddress: serverAddress,
        serverId: session.Id as string,
      }
    })
  }
  return <Flex direction='column' data-testid='JellyfinSessionSelector'>
    <Header>
      <Stack data-testid="JellyfinSessionSelector">
        {store.sessionList.map((session) => {
          const isPlaying = Boolean(session.NowPlayingItem)

          return (
            <Box
              key={session.Id}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={colors.borderColor}
              bg={colors.bg}
              cursor="pointer"
              transition="all 0.15s ease"
              _hover={{
                bg: colors.hoverBg,
                transform: "translateY(-1px)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              onClick={() => handleSessionSelect(session)}
            >
              <Flex justify="space-between" align="start" mb={2}>
                <Box>
                  <Text fontWeight="bold" color={colors.titleColor}>
                    {session.UserName}
                  </Text>
                  <Text fontSize="sm" color={colors.subtitleColor}>
                    {session.Client} · {session.DeviceName}
                  </Text>
                </Box>

                <Badge
                  colorScheme={isPlaying ? "green" : "gray"}
                  variant="subtle"
                >
                  {isPlaying ? "Playing" : "Idle"}
                </Badge>
              </Flex>

              <Box mt={2}>
                {!isPlaying ? (
                  <Text fontSize="sm" color={colors.subtitleColor}>
                    Nothing is currently playing
                  </Text>
                ) : (
                  <Text fontSize="sm" fontWeight={!session.NowPlayingItem ? 'fg.subtle' : 'bold'}>
                    {!session.NowPlayingItem ? 'Nothing is currently playing' : `${session.NowPlayingItem.SeriesName} - ${session.NowPlayingItem.Name}`}
                  </Text>
                )}
              </Box>
            </Box>
          )
        })}
      </Stack>
    </Header>
  </Flex>;
};

export default JellyfinSessionSelector;
