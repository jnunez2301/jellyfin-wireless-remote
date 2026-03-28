import useJellyfinColors from "@/hooks/useJellyfinColors";
import useJellyfinPlayback, { type PlaybackCommand, type SessionCommand } from "@/hooks/useJellyfinPlayback";
import { useCurrentSession } from "@/stores/useJellyfinStore";
import { Center, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { FaFilm } from "react-icons/fa6";
import { IoVolumeMedium, IoVolumeMute } from "react-icons/io5";
import { LuArrowLeft } from "react-icons/lu";
import { PiSpeakerHigh, PiSpeakerLow } from "react-icons/pi";
import { TiMediaFastForward, TiMediaFastForwardOutline, TiMediaPause, TiMediaPlay, TiMediaRewind, TiMediaRewindOutline, TiMediaStop } from "react-icons/ti";
import SubtitleSelector from "./SubtitleSelector";
import KeepWatchingSelector from "./KeepWatchingSelector";
import WhatsNextSelector from "./WhatsNextSelector";

const BOTTOM_COMMAND_BUTTONS_SIZE = '54px';

const RemoteControl = () => {
  const { playback, sessionCommand } = useJellyfinPlayback();
  const { getCurrentSessionInfo } = useJellyfinPlayback();
  const queryClient = useQueryClient();
  const colors = useJellyfinColors();
  const currentSession = useCurrentSession();

  const { sessionId, serverAddress } = useParams({
    from: '/server/$serverAddress/sessions/$sessionId'
  })

  useQuery({
    queryKey: ['remote-client-session', sessionId],
    queryFn: () => getCurrentSessionInfo(sessionId, serverAddress),
    enabled: typeof sessionId == 'string',
    refetchInterval: 5000,
  })

  const invalidateQuery = () => queryClient.invalidateQueries({ queryKey: ['remote-client-session', sessionId] });

  async function handlePlayback(command: PlaybackCommand) {
    if (command == 'Stop') {
      if (!window.confirm('This will close the current player, are you sure?')) return;
    }
    await playback(serverAddress, sessionId, command);
    invalidateQuery();
  }

  async function handleSessionCommand(command: SessionCommand) {
    await sessionCommand(serverAddress, sessionId, command);
    invalidateQuery();
  }

  const itemId = currentSession?.NowPlayingItem?.Id ?? '';
  const currentSubtitleIndex = currentSession?.PlayState?.SubtitleStreamIndex ?? -1;

  return <Flex direction='column' align='center' gap='2' data-testid='RemoteControl'>
    <Flex w='100%' justify='space-between'>
      <Link to="..">
        <IconButton variant='ghost'>
          <LuArrowLeft />
        </IconButton>
      </Link>
      <Flex gap='1'>
        <KeepWatchingSelector serverAddress={serverAddress} sessionId={sessionId} />

        <Link to="/server/$serverAddress/sessions/$sessionId/library" params={{ serverAddress: serverAddress, sessionId: sessionId }}>
          <IconButton variant='ghost' p='3'>
            Media
            <FaFilm />
          </IconButton>
        </Link>
      </Flex>
    </Flex>
    {/* PLAY BUTTON */}
    <Center>
      <IconButton
        cursor="pointer"
        variant='solid'
        bg={colors.bg}
        color={colors.titleColor}
        h='150px'
        w='150px'
        rounded='100%'
        onClick={() => handlePlayback("PlayPause")}
      >
        {currentSession?.PlayState?.IsPaused ? <TiMediaPlay /> : <TiMediaPause />}
      </IconButton>
    </Center>
    {/* SERIES INFO */}
    <Flex direction='column' alignItems='center' gap='1' mb='3'>
      <Heading>{!currentSession?.NowPlayingItem?.SeriesName ? "Nothing is playing" : currentSession.NowPlayingItem.SeriesName}</Heading>
      <Text color='fg.muted'>{!currentSession?.NowPlayingItem?.Name ? 'N/A' : currentSession.NowPlayingItem.Name}</Text>
      <Text>{currentSession?.PlayState?.IsPaused ? 'Paused' : 'Playing'}</Text>
      {/* VOLUME BUTTONS */}
      <Flex alignItems='center' gap='10'>
        <IconButton disabled={currentSession?.PlayState?.VolumeLevel === 0} size='2xl' variant='solid' rounded='100%' onClick={() => handleSessionCommand('VolumeDown')}><PiSpeakerLow /></IconButton>
        <Text fontSize='xl' fontWeight='bold' >{currentSession?.PlayState?.VolumeLevel}</Text>
        <IconButton disabled={currentSession?.PlayState?.VolumeLevel === 100} size='2xl' variant='solid' rounded='100%' onClick={() => handleSessionCommand('VolumeUp')}><PiSpeakerHigh /></IconButton>
      </Flex>
      {/* MUTE BUTTON */}
      <Flex alignItems="center" gap='2'>
        <IconButton size='xl' variant={currentSession?.PlayState?.IsMuted ? "solid" : 'subtle'} p='3' my='2' onClick={() => handleSessionCommand(currentSession?.PlayState?.IsMuted ? 'UnMute' : 'Mute')}>
          {!currentSession?.PlayState?.IsMuted ? <><IoVolumeMute /> Mute</> : <><IoVolumeMedium /> Unmute</>}
        </IconButton>
        <SubtitleSelector
          serverAddress={serverAddress}
          sessionId={sessionId}
          itemId={itemId}
          currentSubtitleIndex={currentSubtitleIndex}
          onSubtitleChange={invalidateQuery}
        />
      </Flex>
    </Flex>
    {/* COMMAND BUTTONS */}
    <Flex justify='space-between' gap='1'>
      <IconButton w={BOTTOM_COMMAND_BUTTONS_SIZE} variant='subtle' onClick={() => handlePlayback('PreviousTrack')}><TiMediaRewind /></IconButton>
      <IconButton w={BOTTOM_COMMAND_BUTTONS_SIZE} variant='subtle' onClick={() => handleSessionCommand('MoveLeft')}><TiMediaRewindOutline /></IconButton>
      <IconButton w={BOTTOM_COMMAND_BUTTONS_SIZE} variant='subtle' onClick={() => handlePlayback('Stop')}><TiMediaStop /></IconButton>
      <IconButton w={BOTTOM_COMMAND_BUTTONS_SIZE} variant='subtle' onClick={() => handleSessionCommand('MoveRight')}><TiMediaFastForwardOutline /></IconButton>
      <IconButton w={BOTTOM_COMMAND_BUTTONS_SIZE} variant='subtle' onClick={() => handlePlayback('NextTrack')}><TiMediaFastForward /></IconButton>
    </Flex>
    <WhatsNextSelector
      serverAddress={serverAddress}
      sessionId={sessionId}
    />
  </Flex>;
};

export default RemoteControl;
