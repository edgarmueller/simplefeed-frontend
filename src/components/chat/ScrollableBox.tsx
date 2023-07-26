import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export function ScrollableBox({ children, onScrollToBottom, ...boxProps }: any) {
  const boxRef = useRef<any>(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = boxRef.current;
 
    if (scrollTop + clientHeight === scrollHeight) {
      // Scrolled to the bottom
      if (typeof onScrollToBottom === 'function') {
        onScrollToBottom();
      }
    } 
  };

  useEffect(() => {
    // TODO: Automatically scroll to the bottom when new content is added
    // keep enabled?
    // boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [children]);

  useEffect(() => {
    if (boxRef.current.scrollHeight < boxRef.current.clientHeight) {
      console.log(boxRef.current.scrollHeight, boxRef.current.clientHeight)
      onScrollToBottom();
    }
  });

  return (
    <Box overflow="auto" onScroll={handleScroll} ref={boxRef} {...boxProps}>
      {children}
    </Box>
  );
}
