import { useEffect, useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { BiLike } from "react-icons/bi";
import { Post } from "../../model/domain.interface";
import {
  likePost,
  unlikePost,
} from "../../api/posts";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../hooks/useUser";

const isPostLiked = (post: Post, byUserId: string | undefined) => {
  return post.likes?.find(({ userId, unliked }) => userId === byUserId && !unliked) !== undefined;
}

export interface LikeButtonProps {
	post: Post;
	userId?: string;
}

export const LikeButton = ({ post, userId }: LikeButtonProps) => {
  const { refresh: refreshUserProfile } = useUser();
  const toast = useToast();
  const [isLiked, setLiked] = useState(isPostLiked(post, userId));
  useEffect(() => { setLiked(isPostLiked(post, userId)) }, [post, userId]);
  const likePostMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      refreshUserProfile()
      setLiked(true);
    },
    onError: (error: Error) => {
      toast({
        title: `Like post failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  });
  const unlikePostMutation = useMutation({
    mutationFn: unlikePost,
    onSuccess: () => {
      refreshUserProfile()
      setLiked(false);
    },
    onError: (error: Error) => {
      toast({
        title: `Unlike post failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  });
  return (
    <Button
      size="sm"
      leftIcon={<BiLike />}
      onClick={async () => {
        if (isLiked) {
          unlikePostMutation.mutate(post.id);
        } else {
          likePostMutation.mutate(post.id);
        }
      }}
    >
      {isLiked ? "Unlike" : "Like"}
    </Button>
  );
};
