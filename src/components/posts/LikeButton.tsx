import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { BiLike, BiTrash } from "react-icons/bi";
import { Post } from "../../domain.interface";
import {
  likePost,
  unlikePost,
} from "../../api/posts";

const isPostLiked = (post: Post, byUserId: string | undefined) => {
  return post.likes?.find(({ userId, unliked }) => userId === byUserId && !unliked) !== undefined;
}

export interface LikeButtonProps {
	post: Post;
	userId?: string;
}

export const LikeButton = ({ post, userId }: LikeButtonProps) => {
  const [isLiked, setLiked] = useState(isPostLiked(post, userId));
  useEffect(() => { setLiked(isPostLiked(post, userId)) }, [post, userId]);
  return (
    <Button
      size="sm"
      leftIcon={<BiLike />}
      onClick={async () => {
        if (isLiked) {
          await unlikePost(post.id);
          setLiked(false);
        } else {
          await likePost(post.id);
          setLiked(true);
        }
      }}
    >
      {isLiked ? "Unlike" : "Like"}
    </Button>
  );
};
