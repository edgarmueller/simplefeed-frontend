import { useEffect, useMemo, useState } from "react";
import { fetchFeed } from "../../api/posts";
import { Post as PostEntity } from "../../domain.interface";
import "./PostList.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { uniqBy } from "lodash";
import { Post } from "./Post";
import { SubmitForm } from "../SubmitForm";

export const Feed = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostEntity[]>([]);
  useEffect(() => {
    // TODO: can we fetch by different means
    // fetchLikedPosts();
    fetchFeed(pageNumber).then((page) => {
      setPosts((p) => uniqBy([...p, ...page.items], "id"));
      setHasMore(page.meta.totalPages !== pageNumber);
    });
  }, [pageNumber]);
  const memoedPosts = useMemo(
    () => posts.map((post) => <Post key={post.id} post={post} />),
    [posts]
  );
  return (
    <>
      <SubmitForm
        onSubmit={(newPost: PostEntity) => setPosts((posts) => [newPost, ...posts])}
      />
      {
        posts.length === 0 ? null :
          <InfiniteScroll
            key='my-feed'
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
      }
    </>
  );
};
