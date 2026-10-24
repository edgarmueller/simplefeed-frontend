import { Box } from "@chakra-ui/react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { ReactNode, useEffect, useRef } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import InfiniteScroll from "react-infinite-scroll-component";

export interface ScrollableBoxProps {
  children: ReactNode;
  data: unknown[] | undefined;
  loading: boolean;
  /** called when the user scrolls up to older messages */
  onScrollToTop: () => void;
  /** called when the newest message is visible */
  onScrollToBottom: () => void;
}

/** A scroll container that starts at the bottom, as chats do. */
export function ScrollableBox({
  children,
  onScrollToBottom,
  onScrollToTop,
  loading,
  data,
}: ScrollableBoxProps) {
  const scrollRef = useBottomScrollListener<HTMLDivElement>(onScrollToBottom);
  const [bottomMarkerRef, entry] = useIntersectionObserver();
  // only react to the marker becoming visible, not to a new callback
  const onScrollToBottomRef = useRef(onScrollToBottom);
  useEffect(() => {
    onScrollToBottomRef.current = onScrollToBottom;
  });
  useEffect(() => {
    if (entry?.isIntersecting) {
      onScrollToBottomRef.current();
    }
  }, [entry?.isIntersecting]);

  return (
    <Box
      id="scrollableDiv"
      ref={scrollRef}
      bg="bg.muted"
      borderRadius="md"
      p={2}
      height="300px"
      overflow="auto"
      display="flex"
      flexDirection="column-reverse"
    >
      <InfiniteScroll
        dataLength={data?.length || 0}
        hasMore={!loading}
        inverse={true}
        next={onScrollToTop}
        // puts the loader at the top
        style={{ display: "flex", flexDirection: "column-reverse" }}
        scrollableTarget="scrollableDiv"
        loader={null}
      >
        <div ref={bottomMarkerRef}>&nbsp;</div>
        {children}
      </InfiniteScroll>
    </Box>
  );
}
