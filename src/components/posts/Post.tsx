import { Box, Button } from "@chakra-ui/react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { buildCommentTree, CommentNode, fetchComments } from "../../api/posts";
import { Post as PostEntity, Comment } from "../../domain.interface";
import { CommentItem } from "./CommentItem";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export const Post = ({ post }: { post: PostEntity }) => {
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<Comment[]>();
  const [commentTree, setCommentTree] = useState<CommentNode[]>();
  const fetchMore = useCallback((p: number, commentId = post.id) => {
    fetchComments(post.id, p, commentId).then((fetchedComments) => {
      setComments((prevComments) => {
        const allComments = uniqBy(
          [...(prevComments || []), ...fetchedComments],
          "id"
        );
        return allComments;
      });
    });
  }, [post.id]);
  useEffect(() => {
    fetchMore(page);
  }, [page, fetchMore]);
  useEffect(() => {
    setCommentTree(buildCommentTree(comments || []));
  }, [comments]);
  useEffect(() => {
  }, [commentTree]);
  return (
    <Box key={post.id} bg="gray.100" p={3} borderRadius="md" marginBottom={3}>
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
      <Button size="xs" variant="link" onClick={() => setPage(page + 1)}>
        load more
      </Button>
      <Box bg="white" p={3} borderRadius="md">
        {commentTree?.map((comment) => (
          <CommentItem
            postId={post.id}
            key={comment.comment.id}
            comment={comment}
            fetchMore={fetchMore}
          />
        ))}
      </Box>
    </Box>
  );
};
