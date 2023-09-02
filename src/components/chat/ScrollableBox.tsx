import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";

export function ScrollableBox({
  children,
  onScrollToBottom,
  onScrollToTop,
  loading,
  data,
}: any) {
  const scrollRef = useBottomScrollListener(() => {
    onScrollToBottom();
  });

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      onScrollToBottom();
    }
  }, [inView]);

  return (
    <Box
      id="scrollableDiv"
      style={{
        height: 300,
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
      }}
      ref={scrollRef as any}
    >
      <InfiniteScroll
        dataLength={data?.length || 0}
        hasMore={true && !loading}
        inverse={true}
        next={onScrollToTop}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        scrollableTarget="scrollableDiv"
        loader={<>loading</>}
      >
        <div id="bottom-marker" ref={ref as any}>
          &nbsp;
        </div>
        {loading ? <>loading</> : null}
        {children(scrollRef)}
      </InfiniteScroll>
    </Box>
  );
}
