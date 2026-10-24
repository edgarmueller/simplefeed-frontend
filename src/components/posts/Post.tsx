import { Box, Button, Link, Stack, Text } from "@chakra-ui/react";
import { uniqBy } from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import Markdown, { type Components } from 'react-markdown';
import { Link as RouterLink } from "react-router";
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
import { BotBadge } from "../ui/bot-badge";
import { UserAvatar } from "../ui/user-avatar";

// posts link out a lot, e.g. channels' news stories; keep the feed open
const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => (
    <Link {...props} target="_blank" rel="noopener noreferrer" color="blue.fg" />
  ),
}

type PostHeaderProps = {
  author: {
    username: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
    isBot?: boolean;
  }
  postedTo?: {
    username: string;
    firstName: string;
    lastName: string;
  }
  createdAt: string;
}

function PostHeader({ createdAt, author, postedTo: target }: PostHeaderProps) {
  // posts on one's own feed are "posted to" the author as well
  const postedTo = target && target.username !== author.username ? target : undefined
  return (
    <Stack direction="row" gap={3} alignItems="center" marginBottom={2}>
      <UserAvatar size="sm" name={`${author.firstName} ${author.lastName}`} src={author.imageUrl} />
      <Text color="fg.muted">
        <Link asChild fontWeight="semibold" color="fg">
          <RouterLink to={`/users/${author.username}`}>
            {author.firstName} {author.lastName}
          </RouterLink>
        </Link>
        {postedTo && (
          <>
            {" to "}
            <Link asChild fontWeight="semibold" color="fg">
              <RouterLink to={`/users/${postedTo.username}`}>
                {postedTo.firstName} {postedTo.lastName}
              </RouterLink>
            </Link>
          </>
        )}
      </Text>
      {author.isBot ? <BotBadge /> : null}
      <Text fontSize="sm" color="fg.muted">{formatTimeAgo(createdAt)}</Text>
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
    <Box bg="bg.muted" p={3} borderRadius="md" marginBottom={3}>
      <PostHeader author={post.author} postedTo={post.postedTo} createdAt={post.createdAt} />
      <Box bg="bg" padding={3} borderRadius="md" marginBottom={2}>
        <Markdown components={markdownComponents}>{post.body}</Markdown>
        {(post.attachments || [])
          .filter((attachment) => attachment.type === "video")
          .map((attachment) => (
            <YouTube
              key={attachment.url}
              className="youtubeContainer"
              videoId={attachment.url
                ?.split("&")[0]
                .substring(attachment.url.indexOf("v=") + 2)}
            />
          ))}
        {(post.attachments || [])
          .filter((attachment) => attachment.type === "image")
          .map((attachment) => (
            <img key={attachment.url} src={attachment.url} alt="" />
          ))}
      </Box>
      <Comments
        commentTree={commentTree}
        postId={post.id}
        onReply={onReply}
        fetchComments={fetchComments}
        isExpanded={showComments}
      />
      <Stack direction="row" gap={1}>
        <LikeButton post={post} userId={user?.id} />
        {post.author.id === user?.id && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deletePostMutation.mutate(post.id)}
          >
            <BiTrash />
            Delete
          </Button>
        )}
      </Stack>
    </Box>
  ) : null;
}, isEqual);
Post.displayName = "Post";
export { Post };
