import { Button, Stack, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { submitPost } from '../api/posts';
import { Post } from '../domain.interface';
import { useUser } from '../lib/auth/hooks/useUser';

export const SubmitForm = ({ onSubmit }: { onSubmit: (post: Post) => void }) => {
  const [text, setPostContent] = useState('');
  const { user } = useUser();
	const handleSubmit = async (event: any) => {
    event.preventDefault();
    const post = await submitPost(text, user?.id)
    onSubmit(post);
	};
  return (
    <Stack direction="row" marginBottom={4}>
      <Textarea
        value={text}
        name="postContent"
        id="post_text"
        placeholder="What's on your mind?"
        onChange={(e) => setPostContent(e.target.value)}
      />
      <Button onClick={handleSubmit} color='black' id="post_button">Post</Button>
    </Stack>
  );
};
