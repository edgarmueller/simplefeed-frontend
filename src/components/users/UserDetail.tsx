import { Badge, Box, Card, Heading, Stack, Text } from "@chakra-ui/react";
import { UserAvatar } from "../ui/user-avatar";
import { User } from "../../model/domain.interface";
import { BefriendButton } from "./BefriendButton";
import { UserDetailSmall } from "./UserDetailSmall";

export interface UserDetailProps {
  user: User | null;
  small?: boolean;
  hasFriendRequest?: boolean;
  isFriend?: boolean;
  isMyself?: boolean;
}

export const UserDetail = ({
  isMyself = false,
  user: userProfile,
  small = false,
  hasFriendRequest = false,
  isFriend = false,
}: UserDetailProps) => {

  if (small) {
    return <UserDetailSmall user={userProfile || undefined} />;
  }

  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Heading size="3xl" mb={2}>
          {userProfile?.firstName} {userProfile?.lastName} (
          {userProfile?.username})
        </Heading>
        <Stack direction="row" align="center">
          <UserAvatar name={`${userProfile?.firstName} ${userProfile?.lastName}`} src={userProfile?.imageUrl} size="2xl" />
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
              {isMyself ? null : userProfile?.mutualFriendsCount ? (
                <Text pt="2" fontSize="sm">
                  Mutual Friends: {userProfile.mutualFriendsCount}
                </Text>
              ) : null}
            </Stack>
            <Box>
              {isMyself ? null : isFriend ? (
                <Badge colorPalette="green" variant="outline">
                  Friend
                </Badge>
              ) : (
                <BefriendButton
                  hasFriendRequest={hasFriendRequest}
                  username={userProfile?.username ?? ""}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
