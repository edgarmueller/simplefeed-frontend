import { Box, Flex } from "@chakra-ui/react";
import React from "react";

export interface ListProps<T> {
  elements: T[];
  renderElement: (el: T) => React.ReactNode;
  ifEmpty: React.ReactElement;
}

export const List = <T extends unknown>({ elements, renderElement, ifEmpty }: ListProps<T>) => {
  if (elements.length === 0) {
  	return ifEmpty;
  }
  return (
    <>
      {elements.map((element) => (
        <Box mt={2}>
          <Flex justify={"space-between"} align={"center"}>
            {renderElement(element)}
          </Flex>
        </Box>
      ))}
    </>
  );
};
