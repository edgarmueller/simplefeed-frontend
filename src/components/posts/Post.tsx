import {
  Avatar,
  Box,
  Button,
  Collapse,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { uniqBy } from "lodash";
import isEqual from "lodash/isEqual";
import { memo, useCallback, useEffect, useState } from "react";
import { BiLike, BiTrash } from "react-icons/bi";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import YouTube from "react-youtube";
import {
  CommentNode,
  buildCommentTree,
  deletePost,
  fetchComments,
  likePost,
  unlikePost,
} from "../../api/posts";
import { Comment, Post as PostEntity } from "../../domain.interface";
import { useUser } from "../../lib/auth/hooks/useUser";
import { formatTimeAgo } from "../../lib/time-ago";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

const Post = memo(({ post }: { post: PostEntity }) => {
  const { user, decrementPostCount } = useUser();
  const [comments, setComments] = useState<Comment[]>();
  const [commentTree, setCommentTree] = useState<CommentNode[]>([]);
  const [isLiked, setLiked] = useState(
    post.likes?.find(({ userId }) => userId === user?.id) !== undefined
  );
  useEffect(() => {
    setLiked(
      post.likes?.find(({ userId }) => userId === user?.id) !== undefined
    );
  }, [post, user]);
  const [isVisible, setVisible] = useState(true);
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
        <Text>{post.body}</Text>
        {(post.attachments || []).map(attachment => (
            <YouTube
              className="youtubeContainer"
              videoId={attachment.url.substring(attachment.url.indexOf("v=") + 2)}
            />
        ))}
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
            <Text>
              <i>No comments yet</i>
            </Text>
          )}
          <CommentForm
            postId={post.id}
            path=""
            onSubmit={(comment: Comment) => {
              onReply(comment);
              fetchReplies();
            }}
          />
        </Box>
      </Collapse>
      <Button
        size="sm"
        leftIcon={<BiLike />}
        onClick={async () => {
          if (isLiked) {
            await unlikePost(post.id);
            setLiked(false);
          } else {
            await likePost(post.id);
            setLiked(true);
          }
        }}
      >
        {isLiked ? "Unlike" : "Like"}
      </Button>
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
