import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchPosts } from "../../api/posts";
import { Post as PostEntity } from "../../domain.interface";
import { Post } from "./Post";
import "./PostList.css";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostEntity[]>([]);
  useEffect(() => {
    if (!userId) {
      return;
    }
    // TODO: can we fetch by different means
    // fetchLikedPosts();
    fetchPosts(userId, pageNumber).then((page) => {
      setPosts((p) => uniqBy([...p, ...page.items], "id"));
      setHasMore(page.meta.totalPages !== pageNumber);
    });
  }, [userId, pageNumber]);
  const memoedPosts = useMemo(
    () => posts.map((post) => <Post key={post.id} post={post} />),
    [posts]
  );
  console.log({posts})
  return (
    <>
      <InfiniteScroll
        key={userId}
        dataLength={posts.length}
        next={() => setPageNumber(pageNumber + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {memoedPosts}
      </InfiniteScroll>
    </>
  );
};
