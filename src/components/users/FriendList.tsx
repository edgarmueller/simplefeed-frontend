import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { User } from "../../model/domain.interface";

export interface FriendListProps {
  friends: User[];
  renderFriend: (user: User) => React.ReactNode;
  ifEmpty: React.ReactElement;
}

export const FriendList = ({ friends, renderFriend, ifEmpty }: FriendListProps) => {
  if (friends.length === 0) {
  	return ifEmpty;
  }
  return (
    <>
      {friends.map((friend) => (
        <Box key={friend.id} mt={2}>
          <Flex justify={"space-between"} align={"center"}>
            {renderFriend(friend)}
          </Flex>
        </Box>
      ))}
    </>
  );
};
