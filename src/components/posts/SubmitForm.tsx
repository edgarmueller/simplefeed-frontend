import { Box, Button, FormControl, Stack, Text, Textarea } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
// @ts-ignore
import extractUrls from "extract-urls";
import { submitPost } from "../../api/posts";
import { useUserStore } from "../../stores/useUserStore";
import { FileInput } from "../users/UpdateUserForm";

export interface SubmitFormProps {
  onSubmit?: (post: any) => void;
  postTo?: string;
}

export const SubmitForm = ({ onSubmit, postTo }: SubmitFormProps) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (post) => {
      if (onSubmit) {
        onSubmit(post);
      }
      queryClient.invalidateQueries({
        queryKey: ["feed", "infinite"]
      });
    },
  });
  const handleImageAttached = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments([
      ...attachments,
      {
        type: "image",
        image: event.target.files![0],
        filename: event.target.files![0].name,
      },
    ]);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    mutation.mutate({
      // remove urls from body
      // text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, ""),
      body: text,
      toUserId: postTo || user?.id,
      // map to attachments
      attachments: [
        ...attachments,
        ...(extractUrls(text) || [])
          .filter((url: string) => url.includes("youtube.com"))
          .map((url: string) => ({ type: "video", url })),
      ],
    });
    setText("");
  };
  return (
    <Box alignItems="center" justifyItems={"center"} border={"1px"} borderColor={"gray.200"} borderRadius={"lg"} p={2} mb={2}>
      <FormControl id="post_form" onSubmit={handleSubmit}>
          <Stack direction="column">
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
            <Text fontSize="xs" as="span"><b>Add attachments</b></Text>
            <FileInput
              onChange={handleImageAttached}
              minW="100%"
            />
          </Stack>
      </FormControl>
    </Box>
  );
};
