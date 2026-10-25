import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router";
import { fetchFeed } from "../../api/posts";
import { InfiniteScroll } from "../common/InfiniteScroll";
import { Post } from "./Post";

export const Feed = () => {
  return (
    <Stack gap={4}>
      <Heading size="2xl">Your feed</Heading>
      <InfiniteScroll queryKey={["feed"]} fetchPage={fetchFeed}>
        {(posts) =>
          posts.length === 0 ? (
            <Text color="fg.muted">
              Nothing here yet.{" "}
              <Link asChild color="blue.fg">
                <RouterLink to="/channels">Subscribe to a channel</RouterLink>
              </Link>{" "}
              to fill your feed.
            </Text>
          ) : (
            <div>
              {posts.map((post) => <Post key={post.id} post={post} />)}
            </div>
          )
        }
      </InfiniteScroll>
    </Stack>
  );
};
