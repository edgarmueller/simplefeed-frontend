import { Flex, Box, Text } from "@chakra-ui/react";
import { Link, Icon } from "@chakra-ui/react";
import { FiBell, FiHome, FiLogOut, FiUsers } from "react-icons/fi";
import { FaEnvelope } from "react-icons/fa";
import { BiCog } from "react-icons/bi";
import { Logo } from "./Logo";

export function NavBar() {
  return (
    <Flex
      color="black"
      px={4}
      py={2}
      direction="row"
      align="center"
    >
      <Box>
        <Logo/>
      </Box>
      <Box ml="auto" display="flex" alignItems="center">
        <Link mr={4}>
          <Icon as={FiHome} />
        </Link>
        <Link mr={4}>
          <Icon as={FaEnvelope} />
        </Link>
        <Link mr={4}>
          <Icon as={FiBell} />
        </Link>
        <Link mr={4}>
          <Icon as={FiUsers} />
        </Link>
        <Link mr={4}>
          <Icon as={BiCog} />
        </Link>
        <Link mr={4}>
          <Icon as={FiLogOut} />
        </Link>
      </Box>
    </Flex>
  );
}
