import { Box, Flex } from "@chakra-ui/react";
import React from "react";

export interface ListProps<T> {
  elements: T[];
  getKey: (el: T) => string;
  renderElement: (el: T) => React.ReactNode;
  ifEmpty: React.ReactElement;
}

export const List = <T extends unknown>({ elements, getKey, renderElement, ifEmpty }: ListProps<T>) => {
  if (elements.length === 0) {
  	return ifEmpty;
  }
  return (
    <>
      {elements.map((element) => (
        <Box key={getKey(element)} mt={2}>
          <Flex justify={"space-between"} align={"center"}>
            {renderElement(element)}
          </Flex>
        </Box>
      ))}
    </>
  );
};
