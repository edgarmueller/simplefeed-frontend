import { Box, Button, Card, Link, Stack, Text } from "@chakra-ui/react";
import { isEqual } from "lodash";
import { memo, useState } from "react";
import { BiTrash } from "react-icons/bi";
import Markdown, { type Components } from 'react-markdown';
import { Link as RouterLink } from "react-router";
import YouTube from "react-youtube";
import { deletePost } from "../../api/posts";
import { Post as PostEntity } from "../../model/domain.interface";
import { formatTimeAgo } from "../../lib/time-ago";
import { LikeButton } from "./LikeButton";
import { useUserStore } from "../../stores/useUserStore";
import { useMutation } from "@tanstack/react-query";
import { BotBadge } from "../ui/bot-badge";
import { UserAvatar } from "../ui/user-avatar";

// posts link out a lot, e.g. channels' news stories; keep the feed open
const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => (
    <Link {...props} target="_blank" rel="noopener noreferrer" color="inherit" textDecoration="none" _hover={{ textDecoration: "underline" }} />
  ),
  p: ({ node: _node, ...props }) => <Text {...props} lineHeight="tall" />,
}

/**
 * Channel posts are a linked title, an optional summary and a line about
 * the source, e.g. points, comments and the domain.
 */
const channelPostStyles = {
  "& > p + p": { marginTop: 2 },
  "& > p:first-of-type": { fontSize: "lg", fontWeight: "semibold", lineHeight: "short" },
  "& > p:first-of-type strong": { fontWeight: "inherit" },
  "& > p:not(:first-of-type):last-of-type": { fontSize: "sm", color: "fg.muted" },
  "& > p:not(:first-of-type):last-of-type a": { color: "fg.muted", textDecoration: "underline" },
} as const;

const userPostStyles = {
  "& > p + p": { marginTop: 3 },
} as const;

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
    <Stack direction="row" gap={2} alignItems="center" fontSize="sm">
      <UserAvatar size="2xs" name={`${author.firstName} ${author.lastName}`} src={author.imageUrl} />
      <Text color="fg.muted">
        <Link asChild fontWeight="medium" color="fg">
          <RouterLink to={`/users/${author.username}`}>
            {author.firstName} {author.lastName}
          </RouterLink>
        </Link>
        {postedTo && (
          <>
            {" to "}
            <Link asChild fontWeight="medium" color="fg">
              <RouterLink to={`/users/${postedTo.username}`}>
                {postedTo.firstName} {postedTo.lastName}
              </RouterLink>
            </Link>
          </>
        )}
      </Text>
      {author.isBot ? <BotBadge /> : null}
      <Text color="fg.muted">· {formatTimeAgo(createdAt)}</Text>
    </Stack>
  )
}

const Post = memo(({ post }: { post: PostEntity }) => {
  const { user, setUser } = useUserStore();
  const [isVisible, setVisible] = useState(true);
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setVisible(false);
      if (user) {
        setUser({ ...user, nrOfPosts: user?.nrOfPosts - 1 });
      }
    }
  });

  return isVisible ? (
    <Card.Root as="article" variant="outline" marginBottom={3} _hover={{ borderColor: "border.emphasized" }}>
      <Card.Body gap={3} padding={4}>
        <PostHeader author={post.author} postedTo={post.postedTo} createdAt={post.createdAt} />
        <Box css={post.author.isBot ? channelPostStyles : userPostStyles}>
          <Markdown components={markdownComponents}>{post.body}</Markdown>
        </Box>
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
        <Stack direction="row" gap={1} marginStart={-2} marginBottom={-2}>
          <LikeButton post={post} userId={user?.id} />
          {post.author.id === user?.id && (
            <Button
              size="xs"
              variant="ghost"
              color="fg.muted"
              onClick={() => deletePostMutation.mutate(post.id)}
            >
              <BiTrash />
              Delete
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  ) : null;
}, isEqual);
Post.displayName = "Post";
export { Post };
