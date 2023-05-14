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
import { BiLike } from "react-icons/bi";
import {
  buildCommentTree,
  CommentNode,
  fetchComments,
  likePost,
} from "../../api/posts";
import { Post as PostEntity, Comment } from "../../domain.interface";
import { CommentItem } from "./CommentItem";
import { formatTimeAgo } from "../../lib/time-ago";
import { useAuth } from "../../lib/auth/hooks/useAuth";
import { CommentForm } from "./CommentForm";

const Post = memo(({ post }: { post: PostEntity }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>();
  const [commentTree, setCommentTree] = useState<CommentNode[]>([]);
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
    const newTree = buildCommentTree(comments || []);
    if (!isEqual(newTree, commentTree)) {
      setCommentTree(newTree);
    }
  }, [comments, commentTree]);
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
            onClick={() => {
              onToggle();
              fetchReplies();
            }}
          >
            Comments
          </Button>
        )}
      </Stack>
      <Collapse in={isOpen} animateOpacity>
        <Box bg="white" p={1} borderRadius="md">
          {commentTree.length > 0 ? (
            commentTree?.map((comment) => {
              return (
                <CommentItem
                  postId={post.id}
                  key={comment.comment.id}
                  commentNode={comment}
                  fetchReplies={fetchReplies}
                  onReply={onReply}
                />
              );
            })
          ) : (
            <>
              <Text>
                <i>No comments yet</i>
              </Text>
              <CommentForm
                postId={post.id}
                path=''
                onSubmit={(comment: Comment) => {
                  onReply(comment);
                  fetchReplies();
                }}
              />
            </>
          )}
        </Box>
      </Collapse>
      <Button leftIcon={<BiLike />} onClick={() => likePost(post.id)}>
        {post.likes?.find(({ userId }) => userId === user?.userId) === undefined
          ? "Like"
          : "Unlike"}
      </Button>
    </Box>
  );
});
Post.displayName = "Post";
export { Post };
