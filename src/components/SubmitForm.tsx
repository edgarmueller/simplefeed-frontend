import { Button, Stack, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { submitPost } from '../api/posts';
import { useUser } from '../lib/auth/hooks/useUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const SubmitForm = ({ postTo }: { postTo?: string }) => {
  const [text, setText] = useState('');
  const { user } = useUser();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: (post) => {
      queryClient.invalidateQueries(["feed", "infinite"]);
    }
  })
	const handleSubmit = async (event: any) => {
    event.preventDefault();
    mutation.mutate({ body: text, toUserId: postTo ? postTo : user?.id });
    setText("");
	};
  return (
    <Stack direction="row" marginBottom={4}>
      <Textarea
        value={text}
        name="postContent"
        id="post_text"
        placeholder="What's on your mind?"
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleSubmit} color='black' id="post_button">Post</Button>
    </Stack>
  );
};
