import { Box, Button, Collapsible, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { CommentNode } from "../../model/comments";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Comment, Pagination } from "../../model/domain.interface";
import { useEffect, useState } from "react";

export interface CommentProps {
  commentTree: CommentNode[];
  postId: string;
  onReply: (comment: Comment) => void;
  fetchComments: (
    page: number,
    commentId: string
  ) => Promise<Pagination<Comment>>;
  isExpanded: boolean;
}

export const Comments = ({
  commentTree,
  postId,
  fetchComments,
  onReply,
  isExpanded
}: CommentProps) => {
  const [page, setPage] = useState(0);
  const [loadedItems, setLoadedItems] = useState<number>(0);
  const [totalItems, setTotalItems] = useState(0);
  const { open: isOpen, onToggle } = useDisclosure({ defaultOpen: isExpanded })
  useEffect(() => {
    if (isOpen) {
      setPage(1)
    }
  }, [])
  useEffect(() => {
    async function fetch() {
      if (page > 0) {
        const fetchedPaged = await fetchComments(page, postId);
        setTotalItems(fetchedPaged.meta.totalItems);
        setLoadedItems(loadedItems => loadedItems + fetchedPaged.items.length)
      }
    }
    fetch()
  }, [page, postId])
  return (
    <>
      <Stack direction="row" gap={0} alignItems="center" marginBottom={2}>
        <Button
          size="sm"
          variant="plain"
          px={0}
          color="fg.muted"
          onClick={() => {
            onToggle();
            if (!isOpen) {
              setPage(1);
            }
          }}
        >
          Comments
          {isOpen ? <BsArrowUpCircle /> : <BsArrowDownCircle />}
        </Button>
      </Stack>
      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
        <Box bg="bg" p={1} borderRadius="md">
          {commentTree.length > 0 ? (
            commentTree?.map((comment) => {
              return (
                <CommentItem
                  postId={postId}
                  key={comment.comment.id}
                  commentNode={comment}
                  fetchReplies={fetchComments}
                  onReply={onReply}
                />
              );
            })
          ) : (
            <Text>
              <i>No comments yet</i>
            </Text>
          )}
            <Button
              onClick={() => {
                setPage(page + 1)
              }}
              size="xs"
              variant="plain"
              px={0}
            >
              {/* TODO: hard coded pag limit */}
              {totalItems > 0 ? `${loadedItems} out of ${totalItems} loaded` : 'Load more replies'}
            </Button>
          <CommentForm
            postId={postId}
            path=""
            onSubmit={(comment: Comment) => {
              onReply(comment);
              fetchComments(1, postId);
            }}
          />
        </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};
