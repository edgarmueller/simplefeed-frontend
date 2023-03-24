import { useState } from 'react';
import { postComment } from '../../api/posts';

export interface CommentProps {
	postId: string;
	onSubmit: () => void;
	path?: string
}

export const CommentForm = ({ postId, onSubmit, path }: CommentProps) => {
	const [comment, setComment] = useState('');
	const handleSubmit = (event: any) => {
    event.preventDefault();
		postComment(postId, comment, path).then(() => {
			setComment("")
			onSubmit()
		})
	};
	return (
		<form className='post_comment' onSubmit={handleSubmit}>
			<textarea 
				className="comment" 
				placeholder="Write a comment..." 
				onChange={(e) => setComment(e.target.value)}
				value={comment}
				/>
			<button type="submit">Comment</button>
		</form>
	)
};