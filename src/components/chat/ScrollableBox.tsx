import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export function ScrollableBox({ children, ...boxProps }: any) {
  const boxRef = useRef<any>(null);

  useEffect(() => {
    // Automatically scroll to the bottom when new content is added
    boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [children]);

  return (
    <Box overflow="auto" ref={boxRef} {...boxProps}>
      {children}
    </Box>
  );
}
