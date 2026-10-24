import { Button, Stack, Text, Textarea } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { submitComment } from "../../api/comments";
import { Comment } from "../../model/domain.interface";
import { useMutation } from "@tanstack/react-query";
import { notifyError } from "../ui/toaster";

export interface CommentProps {
  postId: string;
  path?: string;
  onSubmit?: (comment: Comment) => void;
}

export const CommentForm = ({ postId, path, onSubmit }: CommentProps) => {
  const [comment, setComment] = useState("");
  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: (comment: Comment) => {
      if (onSubmit) {
        onSubmit(comment);
      }
      setComment("");
    },
    onError: (error: Error) => notifyError("Posting the comment", error),
  });
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({
      postId,
      content: comment,
      path,
    });
  };

  return (
    <Stack as="form" direction="row" gap={4} m={2} onSubmit={handleSubmit}>
      <Textarea
        className="comment"
        placeholder={`Write a ${(path?.length || 0) > postId.length ? "reply" : "comment"}...`}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        rows={1}
      />
      <Button type="submit" variant="subtle">
        Comment
      </Button>
      {mutation.isError && <Text color="red.500">Failed to post comment</Text>}
    </Stack>
  );
};
