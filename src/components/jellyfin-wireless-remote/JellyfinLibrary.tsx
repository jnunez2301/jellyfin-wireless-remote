import useJellyfin from "@/hooks/useJellyfin";
import useJellyfinMediaManager from "@/hooks/useJellyfinMediaManager";
import useLibraryStore from "@/stores/useLibraryStore";
import { Flex, IconButton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import JellyfinLibraryList from "./JellyfinLibraryList";

const JellyfinLibrary = () => {
  const { serverAddress } = useParams({ from: '/server/$serverAddress/sessions/$sessionId/library' });
  const { getLibraries } = useJellyfinMediaManager({ serverAddress: serverAddress });
  const { getCurrentUserInfo } = useJellyfin();
  const [currentUserId, setCurrentUserId] = useState<string | null | undefined>(null);
  const store = useLibraryStore();
  useQuery({
    queryKey: ['current-user-id', serverAddress],
    queryFn: () => {
      getCurrentUserInfo(serverAddress)
        .then(userInfo => {
          setCurrentUserId(userInfo?.Id);
        });
      return currentUserId;
    }
  })

  useQuery({
    queryKey: ['current-user-library', currentUserId],
    queryFn: () => {
      if (currentUserId) {
        getLibraries(currentUserId);
      }
      return currentUserId;
    },
    enabled: currentUserId != null,
  });
  return <Flex direction='column' gap='2' data-testid='JellyfinLibrary'>
    <Link to=".." >
      <IconButton variant='ghost'>
        <LuArrowLeft />
      </IconButton>
    </Link>
    <JellyfinLibraryList library={store.currentLibrary} />
  </Flex>;
};

export default JellyfinLibrary;
