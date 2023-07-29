import { Box } from "@chakra-ui/react";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';


export function ScrollableBox({
  children,
  onScrollToBottom,
  ref,
  ...boxProps
}: any) {
  const scrollRef = useBottomScrollListener(() => { console.log("bruder!"); onScrollToBottom() });

  return (
    <Box overflowY="scroll" ref={scrollRef}  {...boxProps}>
      {children(scrollRef)}
    </Box>
  );
}
