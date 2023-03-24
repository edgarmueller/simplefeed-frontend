import { useEffect, useState } from "react";
import { fetchPosts } from "../../api/posts";
import { Post as PostEntity } from "../../domain.interface";
import "./PostList.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { uniqBy } from "lodash"
import { Post } from "./Post";

export const PostList = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<PostEntity[]>([]);
  useEffect(() => {
    fetchPosts(pageNumber).then((page) => {
      setPosts(p => uniqBy([...p, ...page.items], 'id'));
      setHasMore(page.meta.totalPages !== pageNumber)//page.meta.currentPage)
    });
  }, [pageNumber])
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setPageNumber(pageNumber + 1)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {posts.map((post) => {
        return (
          <Post post={post} />
        );
      })}
    </InfiniteScroll>
  );
};
