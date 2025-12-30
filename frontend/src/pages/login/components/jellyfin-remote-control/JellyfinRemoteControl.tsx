import { JELLYFIN_ACCESS_TOKEN_KEY } from "@/constants/constants";
import useJellyfinPlayback, { type Command } from "@/hooks/useJellyfinPlayback";
import { Button, Flex } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";

const JellyfinRemoteControl = () => {
  const { playback } = useJellyfinPlayback();
  const userSession = sessionStorage.getItem(JELLYFIN_ACCESS_TOKEN_KEY);
  const { serverId, serverAddress } = useParams({
    from: '/server/$serverAddress/sessions/$serverId'
  })

  function handlePlayback(command: Command) {
    if (userSession) {
      playback(serverAddress, userSession, serverId, command);
    }
  }
  return <Flex direction='column' gap='2' data-testid='JellyfinRemoteControl'>
    <Button onClick={() => handlePlayback('PlayPause')}>Play</Button>
    <Button onClick={() => handlePlayback('Stop')}>Stop</Button>
    <Button onClick={() => handlePlayback('FastForward')}>FastForward</Button>
    <Button onClick={() => handlePlayback('Rewind')}>Rewind</Button>
    <Button onClick={() => handlePlayback('PreviousTrack')}>Previous Track</Button>
    <Button onClick={() => handlePlayback('NextTrack')}>NextTrack</Button>
  </Flex>;
};

export default JellyfinRemoteControl;
