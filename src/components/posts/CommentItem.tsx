import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { UserAvatar } from "../ui/user-avatar";
import { memo, useEffect, useState } from "react";
import { Comment, Pagination } from "../../model/domain.interface";
import { formatTimeAgo } from "../../lib/time-ago";
import { CommentForm } from "./CommentForm";
import { CommentNode } from "../../model/comments";

export interface CommentItemProps {
  postId: string;
  commentNode: CommentNode;
  path?: string;
  level?: number;
  initialPage?: number;
  initialTotalItems?: number;
  fetchReplies?: (
    page: number,
    commentId: string
  ) => Promise<Pagination<Comment>>;
  onReply?: (comment: Comment) => void;
  onRepliesFetched?: (page: Pagination<Comment>) => void;
}

type LoadedItemsProps = {
  loaded: boolean;
  totalItems: number;
  unloadedItems: number;
  loadedItems: number;
}

function LoadedItems({ loaded, totalItems, unloadedItems, loadedItems }: LoadedItemsProps) {
  if (totalItems === 0 && loaded) {
    return <></>
  } else if (totalItems > 0) {
    if (loadedItems === totalItems) {
      return <>{loadedItems} out of {totalItems} loaded</>
    }
    return <>{unloadedItems} left. ({loadedItems} out of {totalItems} loaded)</>
  }
  return <>Load more replies</>
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
    const [loaded, setLoaded] = useState(false)
    const [page, setPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const commentPath = `${path ? `${path}.` : ""}${commentNode.comment.id}`
    const loadedItems = commentNode.children.length
    const unloadedItems = totalItems - loadedItems

    useEffect(() => {
      if (page > totalPages) {
        return;
      }
      if (page > 0) {
        fetchReplies?.(page, commentNode.comment.id).then(
          (resp: Pagination<Comment>) => {
            setTotalPages(resp.meta.totalPages)
            setTotalItems(resp.meta.totalItems)
            onRepliesFetched?.(resp)
          }
        );
      }
    }, [page, fetchReplies, commentNode.comment.id, totalPages]);

    return (
      <Box
        padding={1}
        marginLeft={(level + 1) * 2}
        borderLeftWidth="2px"
        borderLeftStyle="solid"
        borderLeftColor="gray.300"
      >
        <Stack direction="row" gap={2} align="center">
          <UserAvatar size="2xs" name={commentNode.comment.author} />
          <Text fontWeight="bold" fontSize="sm">
            {commentNode.comment.author}
          </Text>
          <Text fontSize="sm" color="fg.muted">
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
              onRepliesFetched={onRepliesFetched}
            />
          ))}
          <Stack direction="row" gap={4} align="center">
            <Button
              onClick={() => setShowReplyForm(!showReplyForm)}
              size="xs"
              variant="plain"
              px={0}
            >
              {showReplyForm ? "Hide" : "Reply"}
            </Button>
            <Button
              onClick={() => {
                setLoaded(true)
                setPage(page + 1)
              }}
              size="xs"
              variant="plain"
              px={0}
            >
              <LoadedItems loaded={loaded} totalItems={totalItems} unloadedItems={unloadedItems} loadedItems={loadedItems} />
            </Button>
            {showReplyForm ? (
              <CommentForm
                postId={postId}
                path={commentPath}
                onSubmit={(postedComment: Comment) => {
                  onReply?.(postedComment);
                  setShowReplyForm(false);
                }}
              />
            ) : null}
          </Stack>
        </Flex>
      </Box>
    );
  }
);
CommentItem.displayName = "CommentItem";
export { CommentItem };
