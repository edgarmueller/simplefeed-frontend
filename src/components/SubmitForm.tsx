import { useState } from 'react';
import { submitPost } from '../api/posts';
import './SubmitForm.css'

export const SubmitForm = () => {
  const [text, setPostContent] = useState('');
	const handleSubmit = (event: any) => {
    event.preventDefault();
    submitPost(text)
	};
  return (
    <>
      <form className="post_form" method="post" onSubmit={handleSubmit}>
        <textarea
          value={text}
          name="postContent"
          id="post_text"
          placeholder="What's on your mind?"
          onChange={(e) => setPostContent(e.target.value)}
        />
        <input type="submit" name="post" id="post_button" value="Post" />
        <hr />
      </form>
    </>
  );
};
