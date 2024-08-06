import { Button, useToast } from "@chakra-ui/react";
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
  const toast = useToast();
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(hasFriendRequest);
  const makeFriendRequestMutation = useMutation({
    mutationFn: (username: string) => makeFriendRequest(username),
    onSuccess: () => {
      setFriendRequestSent(true);
      toast({
        title: "Friend request sent",
        status: "success",
        duration: 5000,
        isClosable: true
      })
    },
    onError: (error: Error) => {
      toast({
        title: `Friend request failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
  })
  const friendRequestExists = hasFriendRequest || friendRequestSent;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        makeFriendRequestMutation.mutate(username)
      }}
      isDisabled={makeFriendRequestMutation.isPending || friendRequestExists}
    >
      {
        friendRequestExists ? "Friend request sent" : "Befriend"
      }
    </Button>
  );
};
