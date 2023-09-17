import {
  Box,
  Button,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
// @ts-ignore
import extractUrls from "extract-urls";
import { submitPost } from "../api/posts";
import { useUser } from "../lib/auth/hooks/useUser";

export interface SubmitFormProps {
  onSubmit?: (post: any) => void;
  postTo?: string;
}

export const SubmitForm = ({ onSubmit, postTo }: SubmitFormProps) => {
  const [text, setText] = useState("");
  const { user } = useUser();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (post) => {
      if (onSubmit) onSubmit(post);
      queryClient.invalidateQueries(["feed", "infinite"]);
    },
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    mutation.mutate({
      // remove urls from body
      body: text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ''),
      toUserId: postTo ? postTo : user?.id,
      attachments: extractUrls(text)
        .filter((url: string) => url.includes("youtube.com"))
        .map((url: string) => ({ type: 'video', url })),
    });
    setText("");
  };
  return (
    <Box marginBottom={4}>
      <Stack direction="row">
        <Textarea
          value={text}
          name="postContent"
          id="post_text"
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleSubmit} color="black" id="post_button">
          Post
        </Button>
      </Stack>
    </Box>
  );
};
