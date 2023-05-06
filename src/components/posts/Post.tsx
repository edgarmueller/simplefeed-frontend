import {
  Avatar,
  Box,
  Button,
  Collapse,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import isEqual from "lodash/isEqual";
import { uniqBy } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { buildCommentTree, CommentNode, fetchComments } from "../../api/posts";
import { Post as PostEntity, Comment } from "../../domain.interface";
import { CommentItem } from "./CommentItem";
import { formatTimeAgo } from "../../lib/time-ago";

const Post = memo(({ post }: { post: PostEntity }) => {
  const [comments, setComments] = useState<Comment[]>();
  const [rootComments, setRootComments] = useState<CommentNode[]>([]);
  const { isOpen, onToggle } = useDisclosure();
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
    fetchReplies();
  }, [fetchReplies]);
  useEffect(() => {
    const newTree = buildCommentTree(comments || []);
    if (!isEqual(newTree, rootComments)) {
      setRootComments(newTree);
    }
  }, [comments, rootComments]);
  const onReply = useCallback((comment: Comment) => {
    setComments((prevComments) => [...(prevComments || []), comment]);
  }, []);
  return (
    <Box key={post.id} bg="gray.100" p={3} borderRadius="md" marginBottom={3}>
      <Stack direction="row" spacing={4} alignItems="center" marginBottom={2}>
        <Avatar
          size="sm"
          name={post.author.profile?.username}
          src={post.author.profile?.imageUrl}
        />
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
        <Box marginBottom={4}>{formatTimeAgo(post.createdAt)}</Box>
      </Stack>
      <Box bg="white" padding={2} borderRadius="md" marginBottom={4}>
        <Text>{post.body}</Text>
      </Box>
      <Stack direction="row" spacing={0} alignItems="center" marginBottom={2}>
        {isOpen ? (
          <Button
            size="sm"
            variant="link"
            rightIcon={<BsArrowUpCircle />}
            onClick={onToggle}
          >
            Comments
          </Button>
        ) : (
          <Button
            size="sm"
            variant="link"
            rightIcon={<BsArrowDownCircle />}
            onClick={onToggle}
          >
            Comments
          </Button>
        )}
      </Stack>
      <Collapse in={isOpen} animateOpacity>
        <Box bg="white" p={1} borderRadius="md">
          {rootComments.length > 0 ? (
            rootComments?.map((comment) => {
              return (
                <CommentItem
                  postId={post.id}
                  key={comment.comment.id}
                  commentNode={comment}
                  fetchReplies={fetchReplies}
                  onReply={onReply}
                  initialPage={1}
                />
              );
            })
          ) : (
            <Text>
              <i>No comments yet</i>
            </Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
});
Post.displayName = "Post";
export { Post };
