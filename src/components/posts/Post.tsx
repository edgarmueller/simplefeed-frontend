import {
  Avatar,
  Box,
  Button,
  Link,
  Stack
} from "@chakra-ui/react";
import { uniqBy } from "lodash";
import isEqual from "lodash/isEqual";
import { memo, useCallback, useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import Markdown from 'react-markdown';
import { Link as RouterLink } from "react-router-dom";
import YouTube from "react-youtube";
import {
  CommentNode,
  buildCommentTree,
  deletePost,
  fetchComments,
} from "../../api/posts";
import { Comment, Post as PostEntity } from "../../domain.interface";
import { useUser } from "../../hooks/useUser";
import { formatTimeAgo } from "../../lib/time-ago";
import { Comments } from "./Comments";
import { LikeButton } from "./LikeButton";

const Post = memo(({ post }: { post: PostEntity }) => {
  const { user, decrementPostCount } = useUser();
  const [comments, setComments] = useState<Comment[]>();
  const [commentTree, setCommentTree] = useState<CommentNode[]>([]);
  const [isVisible, setVisible] = useState(true);
  const fetchReplies = useCallback(
    (p: number = 1, commentId = post.id) => {
      return fetchComments(post.id, p, commentId).then(
        (fetchedCommentsPaginated) => {
          setComments((prevComments) => {
            const allComments = uniqBy(
              [...(prevComments || []), ...fetchedCommentsPaginated.items],
              "id"
            );
            return isEqual(allComments, prevComments)
              ? prevComments
              : allComments;
          });
          return fetchedCommentsPaginated;
        }
      );
    },
    [post.id]
  );
  useEffect(() => {
    const newTree = buildCommentTree(comments || []);
    if (!isEqual(newTree, commentTree)) {
      setCommentTree(newTree);
    }
  }, [comments, commentTree]);
  const onReply = useCallback((comment: Comment) => {
    setComments((prevComments) => [...(prevComments || []), comment]);
  }, []);
  return isVisible ? (
    <Box key={post.id} bg="gray.100" p={3} borderRadius="md" marginBottom={3}>
      <Stack direction="row" spacing={4} alignItems="center" marginBottom={2}>
        <Avatar
          size="sm"
          name={post.author.username}
          src={post.author.imageUrl}
        />
        <div className="posted_by" style={{ color: "#ACACAC" }}>
          <Link as={RouterLink} to={`/users/${post.author.username}`}>
            {post.author.firstName} {post.author.lastName}
          </Link>{" "}
          {post.postedTo && "to "}
          {post.postedTo && (
            <Link as={RouterLink} to={`/users/${post.postedTo.username}`}>
              {post.postedTo.firstName} {post.postedTo.lastName}
            </Link>
          )}
        </div>
        <Box marginBottom={4}>{formatTimeAgo(post.createdAt)}</Box>
      </Stack>
      <Box bg="white" padding={2} borderRadius="md" marginBottom={4}>
        <Markdown>{post.body}</Markdown>
        {(post.attachments || [])
          .filter((attachment) => attachment.type === "video")
          .map((attachment) => (
            <YouTube
              className="youtubeContainer"
              videoId={attachment.url
                ?.split("&")[0]
                .substring(attachment.url.indexOf("v=") + 2)}
            />
          ))}
        {(post.attachments || [])
          .filter((attachment) => attachment.type === "image")
          .map((attachment) => (
            <img src={attachment.url} />
          ))}
      </Box>
      <Comments 
        commentTree={commentTree}
        postId={post.id}
        onReply={onReply}
        fetchReplies={fetchReplies}
      />
      <LikeButton post={post} userId={user?.id}/> 
      {post.author.id === user?.id && (
        <Button
          size="sm"
          leftIcon={<BiTrash />}
          onClick={async () => {
            await deletePost(post.id);
            setVisible(false);
            decrementPostCount();
          }}
        >
          Delete
        </Button>
      )}
    </Box>
  ) : null;
});
Post.displayName = "Post";
export { Post };
