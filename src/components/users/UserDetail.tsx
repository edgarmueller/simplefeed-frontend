import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
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
    <Card variant="outline">
      <CardBody>
        <Heading mb={2}>
          {userProfile?.firstName} {userProfile?.lastName} (
          {userProfile?.username})
        </Heading>
        <Stack direction="row" align="center">
          <Avatar name={`${userProfile?.firstName} ${userProfile?.lastName}`} src={userProfile?.imageUrl} size="xl" />
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
                <Badge colorScheme="green" variant="outline">
                  Friend
                </Badge>
              ) : (
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
