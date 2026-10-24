import { Button } from "@chakra-ui/react";
import { notifyError, notifySuccess } from "../ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { makeFriendRequest } from "../../api/friends";

export interface BefriendButtonProps {
  username: string;
  hasFriendRequest: boolean;
}

export const BefriendButton = ({
  username,
  hasFriendRequest,
}: BefriendButtonProps) => {
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(hasFriendRequest);
  const makeFriendRequestMutation = useMutation({
    mutationFn: (username: string) => makeFriendRequest(username),
    onSuccess: () => {
      setFriendRequestSent(true);
      notifySuccess("Friend request sent");
    },
    onError: (error: Error) => notifyError("Sending the friend request", error),
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
      {
        friendRequestExists ? "Friend request sent" : "Befriend"
      }
    </Button>
  );
};
