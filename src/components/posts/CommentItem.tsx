import { Avatar, Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { CommentNode } from "../../api/posts";
import { Comment, Pagination } from "../../domain.interface";
import { CommentForm } from "./CommentForm";
import { formatTimeAgo } from "../../lib/time-ago";

export interface CommentItemProps {
  postId: string;
  commentNode: CommentNode;
  path?: string;
  level?: number;
  initialPage?: number;
  fetchReplies?: (
    page: number,
    commentId: string
  ) => Promise<Pagination<Comment>>;
  onReply?: (comment: Comment) => void;
  onRepliesFetched?: (page: Pagination<Comment>) => void;
}

const CommentItem = memo(
  ({
    postId,
    commentNode,
    path,
    fetchReplies,
    onReply,
    onRepliesFetched,
    level = 0,
    initialPage = 0,
  }: CommentItemProps) => {
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const commentPath = `${path ? `${path}/` : ""}${commentNode.comment.id}`;
    const onRepliesFetchedDefault = (page: Pagination<Comment>) => {
      setTotalItems(totalItems => totalItems - page.items.length)
    };
    useEffect(() => {
      if (page > 0) {
        fetchReplies &&
          fetchReplies(page, commentNode.comment.id).then(
            (resp: Pagination<Comment>) => {
              setTotalPages(resp.meta.totalPages);
              setTotalItems(resp.meta.totalItems);
              onRepliesFetched ? onRepliesFetched(resp) : onRepliesFetchedDefault(resp);
            }
          );
      }
    }, [page, fetchReplies, commentNode.comment.id]);
    // recursively render children nodes

    return (
      <Box
        padding={1}
        marginLeft={(level + 1) * 2}
        borderLeftWidth="2px"
        borderLeftStyle="solid"
        borderLeftColor="gray.300"
      >
        <Stack direction="row" spacing={2}>
          <Avatar
            size="xs"
            name={commentNode.comment.author}
            src="https://bit.ly/broken-link"
          />
          <Text fontWeight="bold" fontSize="sm" marginBottom={2}>
            {commentNode.comment.author}
          </Text>
          <Text fontSize="sm">
            {formatTimeAgo(commentNode.comment.createdAt)}
          </Text>
        </Stack>
        <Flex direction="column" w="100%">
          <Text fontSize="sm" marginBottom={0} paddingTop={1}>
            {commentNode.comment.content}
          </Text>
          {commentNode.children.map((reply) => (
            <CommentItem
              key={reply.comment.id}
              postId={postId}
              commentNode={reply}
              path={commentPath}
              fetchReplies={fetchReplies}
              onReply={onReply}
              onRepliesFetched={onRepliesFetched || onRepliesFetchedDefault}
            />
          ))}
          <Stack direction="row" spacing={4} align="center">
            <Button
              onClick={() => setShowReplyForm(!showReplyForm)}
              size="xs"
              variant="link"
            >
              {showReplyForm ? "Hide" : "Reply"}
            </Button>
            {showReplyForm ? (
              <CommentForm
                postId={postId}
                path={commentPath}
                onSubmit={(postedComment: any) => {
                  onReply &&
                    onReply({
                      ...postedComment,
                      author: postedComment.author,
                      postId,
                    });
                  setShowReplyForm(false);
                }}
              />
            ) : null}
            {page < totalPages ? (
              <Button
                onClick={() => setPage(page + 1)}
                size="xs"
                variant="link"
              >
                {/* TODO: hard coded pag limit */}
                {totalItems > 0 ? `Show ${totalItems - page * 3} more replies` : 'Load more replies'}
              </Button>
            ) : (
              <Button
                onClick={() => fetchReplies && fetchReplies(page, commentNode.comment.id)}
                size="xs"
                variant="link"
              >
                Refetch
              </Button>
            )}
          </Stack>
        </Flex>
      </Box>
    );
  }
);
CommentItem.whyDidYouRender = true;
CommentItem.displayName = "CommentItem";
export { CommentItem };
