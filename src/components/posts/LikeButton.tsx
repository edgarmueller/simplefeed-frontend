import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { notifyError } from "../ui/toaster";
import { BiLike } from "react-icons/bi";
import { Post } from "../../model/domain.interface";
import {
  likePost,
  unlikePost,
} from "../../api/posts";
import { useMutation } from "@tanstack/react-query";

const isPostLiked = (post: Post, byUserId: string | undefined) => {
  return post.likes?.find(({ userId, unliked }) => userId === byUserId && !unliked) !== undefined;
}

export interface LikeButtonProps {
	post: Post;
	userId?: string;
}

export const LikeButton = ({ post, userId }: LikeButtonProps) => {
  // what the user toggled since the post was loaded, if anything
  const [likedOverride, setLiked] = useState<boolean>();
  const isLiked = likedOverride ?? isPostLiked(post, userId);
  const likePostMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      setLiked(true);
    },
    onError: (error: Error) => notifyError("Liking the post", error),
  });
  const unlikePostMutation = useMutation({
    mutationFn: unlikePost,
    onSuccess: () => {
      setLiked(false);
    },
    onError: (error: Error) => notifyError("Unliking the post", error),
  });
  return (
    <Button
      size="sm"
      variant="ghost"
      title={post.author.isBot ? "Likes tell the channel to pick more stories like this" : undefined}
      onClick={() => {
        if (isLiked) {
          unlikePostMutation.mutate(post.id);
        } else {
          likePostMutation.mutate(post.id);
        }
      }}
    >
      <BiLike />
      {isLiked ? "Unlike" : "Like"}
    </Button>
  );
};
