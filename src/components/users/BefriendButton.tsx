import { Button } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { makeFriendRequest as makeFriendRequestApi } from "../../api/friend-requests";

export interface BefriendButtonProps {
  username: string;
  hasFriendRequest: boolean;
}

export const BefriendButton = ({
  username,
  hasFriendRequest,
}: BefriendButtonProps) => {
	const [friendRequestSent, setFriendRequestSent] = useState<boolean>(hasFriendRequest);
  const makeFriendRequest = useMutation({
    mutationFn: (username: string) => makeFriendRequestApi(username)
  }) 

  if (hasFriendRequest || friendRequestSent) {
    return (
      <Button variant="outline" size="sm" isDisabled>
        Friend request sent
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
					await makeFriendRequest.mutate(username)
					setFriendRequestSent(true)
				}}>
        Befriend
      </Button>
    </>
  );
};
