import {
  Button, Stack,
  Textarea
} from "@chakra-ui/react";
import { useState } from "react";
import { postComment } from "../../api/posts";

export interface CommentProps {
  postId: string;
  path?: string;
}

export const CommentForm = ({ postId, path }: CommentProps) => {
  const [comment, setComment] = useState("");
  const handleSubmit = (event: any) => {
    event.preventDefault();
    postComment(postId, comment, path).then(() => {
      setComment("");
    });
  };
  return (
    <Stack direction="row" spacing={4}>
			<Textarea
				className="comment"
				placeholder="Write a comment..."
				onChange={(e) => setComment(e.target.value)}
				value={comment}
			/>
			<Button type="submit" onClick={handleSubmit}>
				Comment
			</Button>
    </Stack>
  );
};
