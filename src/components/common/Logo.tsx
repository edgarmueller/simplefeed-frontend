import { Stack, Text } from "@chakra-ui/react";
import { FaDotCircle } from "react-icons/fa";

export const Logo = ({ inversed = false}) => (
  <Stack direction="row" justify="center">
    <Text fontSize="xl" as="b" color={inversed ? "white" : "black"}>
      SimpleFeed
    </Text>
    <FaDotCircle color={inversed ? "white" : "black"}/>
  </Stack>
);

