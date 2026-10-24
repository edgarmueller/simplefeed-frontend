import { Button } from "@chakra-ui/react";
import { notifyError, notifySuccess } from "../ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { makeFriendRequest } from "../../api/friends";

export interface BefriendButtonProps {
  username: string;
  hasFriendRequest: boolean;
  /** channels are subscribed to rather than befriended */
  isChannel?: boolean;
}

export const BefriendButton = ({
  username,
  hasFriendRequest,
  isChannel = false,
}: BefriendButtonProps) => {
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(hasFriendRequest);
  const makeFriendRequestMutation = useMutation({
    mutationFn: (username: string) => makeFriendRequest(username),
    onSuccess: () => {
      setFriendRequestSent(true);
      notifySuccess(isChannel ? "Subscribed. The channel will confirm shortly." : "Friend request sent");
    },
    onError: (error: Error) =>
      notifyError(isChannel ? "Subscribing" : "Sending the friend request", error),
  })
  const friendRequestExists = hasFriendRequest || friendRequestSent;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        makeFriendRequestMutation.mutate(username)
      }}
      disabled={makeFriendRequestMutation.isPending || friendRequestExists}
    >
      {friendRequestExists
        ? isChannel ? "Subscription requested" : "Friend request sent"
        : isChannel ? "Subscribe" : "Befriend"}
    </Button>
  );
};
