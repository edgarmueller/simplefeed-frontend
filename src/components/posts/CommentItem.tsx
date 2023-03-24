import { useCallback, useEffect, useState } from "react";
import { fetchComments, fetchReplies } from "../../api/posts";
import { Comment as CommentEntity } from "../../domain.interface";
import { CommentForm } from "./CommentForm";
import { Button, Flex, Text, Avatar } from '@chakra-ui/react';

export interface CommentItemProps {
  postId: string;
  comment: CommentEntity;
  lazy: boolean;
  path?: string;
  level?: number;
}

export const CommentItem = ({
  postId,
  comment,
  lazy,
  path,
  level = 0,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const fetchCommentList = useCallback(() => {
    if (comment.id) {
      fetchReplies(postId, comment.id).then((cs) => setComments(cs));
    } else {
      fetchComments(postId).then((cs) => setComments(cs));
    }
  }, [comment.id, postId]);
  useEffect(() => {
    if (!showReplies) {
      return;
    }
    fetchCommentList();
  }, [showReplies, fetchCommentList]);

  const indentStyle = { pl: `${(level + 1) * 4}`, borderLeft: "1px solid gray" };
  //return (
  //  <div>
  //    {comment.content}
  //    <CommentThread comments={comments} postId={postId} lazy path={path} />
  //    <button onClick={() => setShouldFetch(true)}>Show Replies</button>
  //    <button onClick={() => setShowReply(!showReply)}>Reply</button>
  //    {showReply ? (
  //      <CommentForm
  //        postId={postId}
  //        onSubmit={() => {
  //          console.log("refetch");
  //          fetchCommentList();
  //        }}
  //			path={path}
  //      />
  //    ) : null}
  //  </div>
  //);

  return (
    <Flex alignItems="flex-start" p="2" borderBottom="1px solid gray" {...indentStyle}>
      <Avatar name={comment.author} src="https://bit.ly/broken-link" mr="2" />
      <Flex direction="column" w="100%">
        <Text fontWeight="bold" fontSize="sm">
          {comment.author}
        </Text>
        <Text>{comment.content}</Text>
        {comments.length > 0 && (
          <>
            {showReplies &&
              comments.map((comment, index) => (
                <CommentItem
                  postId={postId}
                  key={index}
                  comment={comment}
                  lazy
                  level={level + 1}
                />
              ))}
          </>
        )}
        <Button
          onClick={() => setShowReplyForm(!showReplyForm)}
          mt="2"
          size="xs"
          variant="link"
        >
          {showReplyForm ? "Hide" : "Reply"}
        </Button>
        <Button
          onClick={() => setShowReplies(!showReplies)}
          mt="2"
          mb="1"
          size="xs"
          variant="outline"
        >
          {showReplies ? "Hide replies" : "Show replies"}
        </Button>
        {showReplyForm && (
          <CommentForm
            postId={postId}
            onSubmit={() => {
              console.log("refetch");
              fetchCommentList();
            }}
            path={path}
          />
        )}
      </Flex>
    </Flex>
  );
};
