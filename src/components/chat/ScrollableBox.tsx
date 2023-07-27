import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export function ScrollableBox({
  children,
  onScrollToBottom,
  ...boxProps
}: any) {
  const boxRef = useRef<any>(null);
  useEffect(() => {
    const boxElement = boxRef.current;

    const handleIntersection = (entries: any) => {
      const isIntersecting = entries[0].isIntersecting;
      if (isIntersecting) {
        onScrollToBottom();
      }
    };

    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.1, // 10% of the box visible is considered as intersection
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    observer.observe(boxElement);

    return () => {
      observer.disconnect();
    };
  }, [onScrollToBottom]);

  return (
    <Box overflowY="scroll" ref={boxRef} {...boxProps}>
      {children}
    </Box>
  );
}
