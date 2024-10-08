import {
  Avatar,
  Box,
  Button,
  Link,
  Stack
} from "@chakra-ui/react";
import { uniqBy } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import Markdown from 'react-markdown';
import { Link as RouterLink } from "react-router-dom";
import YouTube from "react-youtube";
import { isEqual } from "lodash";
import {
  deletePost,
} from "../../api/posts";
import { fetchComments as fetchCommentsApi } from "../../api/comments";
import { Comment, Pagination, Post as PostEntity } from "../../model/domain.interface";
import { formatTimeAgo } from "../../lib/time-ago";
import { Comments } from "./Comments";
import { LikeButton } from "./LikeButton";
import { useUserStore } from "../../stores/useUserStore";
import { CommentNode, buildCommentTree } from "../../model/comments";
import { useMutation } from "@tanstack/react-query";

type PostHeaderProps = {
  author: {
    username: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
  }
  postedTo?: {
    username: string;
    firstName: string;
    lastName: string;
  }
  createdAt: string;
}

function PostHeader({ createdAt, author, postedTo }: PostHeaderProps) {
  return (
    <Stack direction="row" spacing={4} alignItems="center" marginBottom={2}>
      <Avatar
        size="sm"
        name={author.username}
        src={author.imageUrl}
      />
      <div className="posted_by" style={{ color: "#ACACAC" }}>
        <Link as={RouterLink} to={`/users/${author.username}`}>
          {author.firstName} {author.lastName}
        </Link>{" "}
        {postedTo && "to "}
        {postedTo && (
          <Link as={RouterLink} to={`/users/${postedTo.username}`}>
            {postedTo.firstName} {postedTo.lastName}
          </Link>
        )}
      </div>
      <Box marginBottom={4}>{formatTimeAgo(createdAt)}</Box>
    </Stack>
  )
}

const Post = memo(({ post, showComments = false }: { post: PostEntity, showComments: boolean }) => {
  const { user, setUser } = useUserStore();
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setVisible(false);
      if (user) {
        setUser({ ...user, nrOfPosts: user?.nrOfPosts - 1 });
      }
    }
  });
  const [comments, setComments] = useState<Pagination<Comment>>({
    items: [],
    meta: {
      currentPage: 1,
      itemCount: 0,
      totalPages: 1,
      totalItems: 0,
    },
  });
  const [commentTree, setCommentTree] = useState<CommentNode[]>([]);
  const [isVisible, setVisible] = useState(true);
  const fetchComments = useCallback(
    async (page: number = 1, commentId = post.id) => {
      const paginatedComments = await fetchCommentsApi(post.id, page, commentId)
      setComments((prevComments) => {
        const allComments = uniqBy(
          [...(prevComments.items || []), ...paginatedComments.items],
          "id"
        );
        return isEqual(allComments, prevComments.items)
          ? prevComments
          : { ...prevComments, items: allComments };
      });
      return paginatedComments;
    },
    [post.id]
  );
  useEffect(() => {
    const newTree = buildCommentTree(comments.items || []);
    if (!isEqual(newTree, commentTree)) {
      setCommentTree(newTree);
    }
  }, [comments, commentTree]);
  const onReply = useCallback((comment: Comment) => {
    setComments((prevComments) => ({ ...prevComments, items: [...(prevComments.items || []), comment] }));
  }, []);

  return isVisible ? (
    <Box key={post.id} bg="gray.100" p={3} borderRadius="md" marginBottom={3}>
      <PostHeader author={post.author} postedTo={post.postedTo} createdAt={post.createdAt} />
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
            <img key={attachment.url} src={attachment.url} />
          ))}
      </Box>
      <Comments
        commentTree={commentTree}
        postId={post.id}
        onReply={onReply}
        fetchComments={fetchComments}
        isExpanded={showComments}
      />
      <LikeButton post={post} userId={user?.id} />
      {post.author.id === user?.id && (
        <Button
          size="sm"
          leftIcon={<BiTrash />}
          onClick={async () => {
            await deletePostMutation.mutate(post.id);
          }}
        >
          Delete
        </Button>
      )}
    </Box>
  ) : null;
}, isEqual);
Post.displayName = "Post";
export { Post };
