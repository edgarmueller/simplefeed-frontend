import { Alert, Button, Center, Link, Spinner, Text } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { Link as RouterLink } from "react-router";
import { FeedView, fetchFeed } from "../../api/reader";
import { useLastPickedAt } from "../../hooks/useReader";
import { EntryCard } from "./EntryCard";

const EMPTY: Record<FeedView, string> = {
  unread: "You're all caught up.",
  all: "Nothing here yet.",
  saved: "Save stories to read them later; they show up here.",
};

/** The reader's entries, newest first, loading more on scroll and offering new ones as they arrive. */
export const FeedList = ({ view, channelId }: { view: FeedView; channelId?: string }) => {
  const feed = useInfiniteQuery({
    queryKey: ["feed", view, channelId ?? "all-channels"],
    queryFn: ({ pageParam }) => fetchFeed(view, channelId, pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) => (meta.currentPage < meta.totalPages ? meta.currentPage + 1 : undefined),
  });
  const [bottom, atBottom] = useIntersectionObserver();
  const { hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = feed;
  useEffect(() => {
    if (atBottom?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [atBottom?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const entries = feed.data?.pages.flatMap((page) => page.items) ?? [];
  // stories are picked newest first, so anything picked after the newest one shown is new
  const lastPicked = useLastPickedAt(channelId);
  const newestShown = entries[0]?.pickedAt;
  const hasNew = view !== "saved" && feed.isSuccess && !!lastPicked && (!newestShown || lastPicked > newestShown);
  useEffect(() => {
    // an empty list has nothing to lose, so it just loads them
    if (hasNew && !newestShown) void refetch();
  }, [hasNew, newestShown, refetch]);

  if (feed.isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  if (feed.isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>Couldn't load your feed: {feed.error.message}</Alert.Title>
      </Alert.Root>
    );
  }
  return (
    <>
      {hasNew && newestShown ? (
        <Button size="sm" variant="subtle" width="100%" mb={3} onClick={() => refetch()} loading={feed.isRefetching}>
          <BiRefresh />
          Show new stories
        </Button>
      ) : null}
      {entries.length === 0 ? (
        <Text color="fg.muted">
          {EMPTY[view]}
          {view !== "saved" && !channelId ? (
            <>
              {" "}
              <Link asChild color="blue.fg">
                <RouterLink to="/channels">Find more channels</RouterLink>
              </Link>
              .
            </>
          ) : null}
        </Text>
      ) : (
        entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}
      {isFetchingNextPage ? <Spinner /> : null}
      <div ref={bottom} />
    </>
  );
};
