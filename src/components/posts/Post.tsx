import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { fetchComments } from "../../api/posts";
import { Post as PostEntity, Comment } from "../../domain.interface";
import { CommentThread } from "./CommentThread";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export const Post = ({ post }: { post: PostEntity }) => {
	const [showComments, setShowComments] = useState(false)
	const [comments, setComments] = useState<Comment[]>([])
  useEffect(() => {
    if (showComments) {
      fetchComments(post.id).then((cs) => setComments(cs));
    }
  }, [showComments, post.id]);
  return (
    <div key={post.id} className="status_post">
      <div className="profile_pic">
        <Avatar
          size="50"
          round
          name={post.author.profile?.username}
          src={post.author.profile?.imageUrl}
        />
      </div>
      <div className="posted_by" style={{ color: "#ACACAC" }}>
        <a href={post.author.profile.username}>
          {post.author.profile.firstName} {post.author.profile.lastName}
        </a>{" "}
        {post.postedTo && "to "}
        {post.postedTo && (
          <a href={post.postedTo.profile.username}>
            {post.postedTo.profile.firstName} {post.postedTo.profile.lastName}
          </a>
        )}
      </div>
      <div className="posted_at">
        {timeAgo.format(Date.parse(post.createdAt))}
      </div>
      <div className="post_content">
        <p>{post.body}</p>
      </div>
      <div  onClick={() => setShowComments(!showComments)}>{showComments ? "Hide" : "Show"} comments</div>
      {showComments && (
        <>
          <CommentThread postId={post.id} comments={comments} lazy />
        </>
      )}
      <hr />
    </div>
  );
};
