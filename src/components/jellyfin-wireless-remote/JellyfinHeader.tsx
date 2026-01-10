import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const JellyfinHeader = ({ children }: { children: ReactNode }) => {
  return <Flex direction='column' justify='center' gap='3' p='3' alignItems='center'>
    <Link to='/'>
      <Flex direction='column' alignItems='center' gap='1' mb='5'>
        <Image src='/logo.png' w='80px' />
        <Heading>Jellyfin Wireless Remote</Heading>
      </Flex>
    </Link>
    <Box w='100%'>
      {children}
    </Box>
  </Flex>;
};

export default JellyfinHeader;
