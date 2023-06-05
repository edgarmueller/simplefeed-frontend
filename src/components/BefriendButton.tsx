import { Button } from "@chakra-ui/react";
import { makeFriendRequest } from "../api/friend-requests";
import { useState } from "react";

export interface BefriendButtonProps {
  username: string;
  hasFriendRequest: boolean;
}

export const BefriendButton = ({
  username,
  hasFriendRequest,
}: BefriendButtonProps) => {
	const [friendRequestSent, setFriendRequestSent] = useState<boolean>(hasFriendRequest);
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
					await makeFriendRequest(username)
					setFriendRequestSent(true)
				}}>
        Befriend
      </Button>
    </>
  );
};
