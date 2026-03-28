import { Box, Flex, Image } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const Header = ({ children }: { children: ReactNode }) => {
  return <Flex direction='column' justify='center' gap='3' px='3' alignItems='center' mt='7'>
    <Link to='/'>
      <Flex direction='column' alignItems='center' gap='1'>
        <Image src='/logo.png' w='80px' />
      </Flex>
    </Link>
    <Box w='100%'>
      {children}
    </Box>
  </Flex>;
};

export default Header;
