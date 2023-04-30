import { Button, Stack, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { submitPost } from '../api/posts';

export const SubmitForm = () => {
  const [text, setPostContent] = useState('');
	const handleSubmit = (event: any) => {
    event.preventDefault();
    submitPost(text)
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
      <Button onClick={handleSubmit} colorScheme='blue' id="post_button">Post</Button>
    </Stack>
  );
};
