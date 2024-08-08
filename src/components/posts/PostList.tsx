import { fetchPosts } from "../../api/posts";
import { Post as PostEntity } from "../../model/domain.interface";
import { InfiniteScroll } from "../common/InfiniteScroll";
import { Post } from "./Post";
import "./PostList.css";

export interface PostListProps {
  userId: string;
}

export const PostList = ({ userId }: PostListProps) => {
  // TODO: avoid rendering if userId is not set
  if (!userId) return null;
  return (
    <InfiniteScroll queryKey={["posts"]} fetchPage={fetchPosts(userId)}>
      {(posts) => (
        <>
          {posts.map((post, i) => <Post key={post.id} post={post} showComments={false} />)}
        </>
      )}
    </InfiniteScroll>
  )
};
