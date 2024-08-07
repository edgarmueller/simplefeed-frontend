import {
  Button, Stack,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { submitComment } from "../../api/comments";
import { Comment } from "../../model/domain.interface";
import { useMutation } from "@tanstack/react-query";
import { Text } from "@chakra-ui/react";

export interface CommentProps {
  postId: string;
  path?: string;
  onSubmit?: (comment: Comment) => void;
}

export const CommentForm = ({ postId, path, onSubmit }: CommentProps) => {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: (comment: Comment) => {
      if (onSubmit) {
        onSubmit(comment);
      }
      setComment("");
    },
    onError: (error: Error) => {
      toast({
        title: `Post comment failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  });
  const handleSubmit = (event: any) => {
    event.preventDefault();
    mutation.mutate({
      postId,
      content: comment,
      path,
    });
  };

  return (
    <Stack direction="row" spacing={4} m={2}>
      <Textarea
        className="comment"
        placeholder={`Write a ${(path?.length || 0) > postId.length ? "reply" : "comment"}...`}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        rows={1}
      />
      <Button type="submit" onClick={handleSubmit}>
        Comment
      </Button>
      {mutation.isError && <Text color="red.500">Failed to post comment</Text>}
    </Stack>
  );
};
