import { Comment } from "../../domain.interface";
import { CommentItem } from "./CommentItem";

export interface CommentListProps {
  postId: string;
  comments: Comment[];
  lazy?: boolean;
  path?: string;
}

export const CommentThread = ({
  postId,
  comments,
  lazy = false,
  path,
}: CommentListProps) => {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem
          postId={postId}
          comment={comment}
          lazy={lazy}
          key={comment.id}
          path={path ? `${path}/${comment.id}` : comment.id}
        />
      ))}
    </>
  );
};
