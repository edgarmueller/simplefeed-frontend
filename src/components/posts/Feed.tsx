import { fetchFeed } from "../../api/posts";
import { SubmitForm } from "./SubmitForm";
import { InfiniteScroll } from "../common/InfiniteScroll";
import { Post } from "./Post";

export const Feed = () => {
  return (
    <>
      <SubmitForm />
      <InfiniteScroll queryKey={["feed", "infinite"]} fetchPage={fetchFeed}>
        {(posts) => (
          <>
            {posts.map((post, i) => <Post key={post.id} post={post} showComments={false}/>)}
          </>
        )}
      </InfiniteScroll>
    </>
  );
};
