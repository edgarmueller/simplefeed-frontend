import { fetchFeed } from "../../api/posts";
import { Post as PostEntity } from "../../domain.interface";
import { SubmitForm } from "./SubmitForm";
import { InfiniteScroll } from "../common/InfiniteScroll";
import { Post } from "./Post";

export const Feed = () => {
  return (
    <>
      <SubmitForm />
      <InfiniteScroll queryKey={["feed", "infinite"]} queryFn={fetchFeed}>
        {(posts: PostEntity[]) => (
          <>
            {posts.map((post, i) => <Post key={post.id} post={post} />)}
          </>
        )}
      </InfiniteScroll>
    </>
  );
};
