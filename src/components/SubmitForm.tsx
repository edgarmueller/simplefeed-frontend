import { Button, Stack, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { submitPost } from '../api/posts';
import { useAuth } from '../lib/auth/hooks/useAuth';
import { Post } from '../domain.interface';

export const SubmitForm = ({ onSubmit }: { onSubmit: (post: Post) => void }) => {
  const [text, setPostContent] = useState('');
  const { user } = useAuth();
	const handleSubmit = async (event: any) => {
    event.preventDefault();
    const post = await submitPost(text, user?.userId)
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
