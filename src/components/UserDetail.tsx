import {
  Avatar,
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { User } from "../domain.interface";
import { BefriendButton } from "./BefriendButton";
import { UserDetailSmall } from "./UserDetailSmall";

export const UserDetail = ({
  user,
  username,
  small,
  hasFriendRequest,
  isFriend,
}: any) => {
  const [userProfile, setUserProfile] = useState<User | null>(user || null);

  useEffect(() => {
    setUserProfile(user);
  }, [username, user]);

  if (small) {
    return <UserDetailSmall user={user} username={username} clickable />;
  }

  return (
    <Card variant="outline">
      <CardBody>
        <Heading>
          {userProfile?.firstName} {userProfile?.lastName}
        </Heading>
        <Stack direction="row" align="center">
          <Avatar src={userProfile?.imageUrl} size="xl" />
          <Stack direction="row" justify="space-between" w="100%">
            <Stack direction="column">
              <Text pt="2" fontSize="sm">
                Posts: {userProfile?.nrOfPosts} <br />
              </Text>
              <Text pt="2" fontSize="sm">
                Likes: {userProfile?.nrOfLikes}
              </Text>
              <Text pt="2" fontSize="sm">
                Friends: {userProfile?.friends.length}
              </Text>
              {
                userProfile?.mutualFriendsCount ? 
                <Text pt="2" fontSize="sm">
                  Mutual Friends: {userProfile.mutualFriendsCount}
                </Text> : null
              }
            </Stack>
            <Box>
              {isFriend ? null : (
                <BefriendButton
                  hasFriendRequest={hasFriendRequest}
                  username={userProfile?.username!}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};
