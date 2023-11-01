import { Box, Button, Collapse, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
// TODO
import { CommentNode } from "../../api/posts";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Comment, Pagination } from "../../domain.interface";

export interface CommentProps {
  commentTree: CommentNode[];
  postId: string;
  onReply: (comment: Comment) => void;
  fetchReplies: (
    page: number,
    commentId: string
  ) => Promise<Pagination<Comment>>;
}

export const Comments = ({
  commentTree,
  postId,
  fetchReplies,
  onReply,
}: CommentProps) => {
  const { isOpen, onToggle } = useDisclosure();
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
            onClick={() => {
              onToggle();
              fetchReplies(1, postId);
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
            postId={postId}
            path=""
            onSubmit={(comment: Comment) => {
              onReply(comment);
              fetchReplies(1, postId);
            }}
          />
        </Box>
      </Collapse>
    </>
  );
};
