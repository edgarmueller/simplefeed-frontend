import { Box, Button, Stack, Text, Textarea } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
// @ts-expect-error extract-urls ships without types
import extractUrls from "extract-urls";
import { PostAttachment, submitPost } from "../../api/posts";
import { Post } from "../../model/domain.interface";
import { useUserStore } from "../../stores/useUserStore";
import { FileInput } from "../ui/file-input";
import { notifyError } from "../ui/toaster";

export interface SubmitFormProps {
  onSubmit?: (post: Post) => void;
  postTo?: string;
}

export const SubmitForm = ({ onSubmit, postTo }: SubmitFormProps) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (post) => {
      onSubmit?.(post);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (error: Error) => notifyError("Posting", error),
  });
  const handleImageAttached = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachments([...attachments, { type: "image", image: file, filename: file.name }]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const videos = ((extractUrls(text) as string[] | undefined) || [])
      .filter((url) => url.includes("youtube.com"))
      .map((url): PostAttachment => ({ type: "video", url }));
    mutation.mutate({
      body: text,
      toUserId: postTo || user?.id,
      attachments: [...attachments, ...videos],
    });
    setText("");
    setAttachments([]);
  };
  return (
    <Box borderWidth="1px" borderColor="border" borderRadius="lg" p={2} mb={2}>
      <form id="post_form" onSubmit={handleSubmit}>
        <Stack direction="column">
          <Stack direction="row">
            <Textarea
              value={text}
              name="postContent"
              id="post_text"
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" id="post_button" variant="subtle" disabled={!text.trim()}>
              Post
            </Button>
          </Stack>
          <Text fontSize="xs" fontWeight="bold">
            Add attachments
          </Text>
          <FileInput onChange={handleImageAttached} />
        </Stack>
      </form>
    </Box>
  );
};
