import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { CommentNode } from "../../api/posts";

export interface CommentItemProps {
  postId: string;
  comment: CommentNode;
  path?: string;
  level?: number;
  fetchMore?: (page: number, commentId: string) => void;
}

export const CommentItem = ({
  postId,
  comment,
  path,
  fetchMore,
  level = 0,
}: CommentItemProps) => {
  const [page, setPage] = useState(0)
  const [showReplyForm, setShowReplyForm] = useState(false);
  useEffect(() => {
    if (page > 0) {
      fetchMore && fetchMore(page, comment.comment.id)
    }
  }, [page, fetchMore, comment.comment.id])
 
  // recursively render children nodes
  const childNodes = useMemo(() => {
    if (comment.children.length > 0) {
      return comment.children.map((reply) => (
        <CommentItem
          postId={postId}
          comment={reply}
          path={path} // `${path}/${comment.id}`}
          fetchMore={fetchMore}
        />
      ))
    } else {
      return null;
    }
  }, [fetchMore, comment.children, path, postId]);

  return (
    <Box
      p="2"
      marginLeft={(level + 1) * 4}
      borderLeftWidth="2px"
      borderLeftStyle="solid"
      borderLeftColor="gray.300"
    >
      <Avatar name={comment.comment.author} src="https://bit.ly/broken-link" mr="2" />
      <Flex direction="column" w="100%">
        <Text fontWeight="bold" fontSize="sm">
          {comment.comment.author}
        </Text>
        <Text>{comment.comment.content}</Text>
        {childNodes}
        <Stack direction="row" spacing={4} align="center">
          <Button
            onClick={() => setShowReplyForm(!showReplyForm)}
            size="xs"
            variant="link"
          >
            {showReplyForm ? "Hide" : "Reply"}
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            size="xs"
            variant="link"
          >
            load more replies
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};
