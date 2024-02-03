import { Box, Button, Collapse, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
// TODO
import { COMMENTS_FETCH_LIMIT, CommentNode } from "../../api/posts";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Comment, Pagination } from "../../domain.interface";
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
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: isExpanded })
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
            onClick={async () => {
              onToggle();
              setPage(1 )
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
              variant="link"
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
      </Collapse>
    </>
  );
};
