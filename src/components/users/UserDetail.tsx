import { Badge, Box, Card, Heading, Stack, Text } from "@chakra-ui/react";
import { UserAvatar } from "../ui/user-avatar";
import { User } from "../../model/domain.interface";
import { BotBadge } from "../ui/bot-badge";
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
        <Stack direction="row" align="center" mb={2} gap={3}>
          <Heading size="3xl">
            {userProfile?.firstName} {userProfile?.lastName} ({userProfile?.username})
          </Heading>
          {userProfile?.isBot ? <BotBadge /> : null}
        </Stack>
        {userProfile?.bio ? (
          <Text color="fg.muted" mb={2}>
            {userProfile.bio}
          </Text>
        ) : null}
        <Stack direction="row" align="center">
          <UserAvatar name={`${userProfile?.firstName} ${userProfile?.lastName}`} src={userProfile?.imageUrl} size="2xl" />
          <Stack direction="row" justify="space-between" w="100%">
            <Stack direction="column">
              <Text pt="2" fontSize="sm">
                Posts: {userProfile?.nrOfPosts} <br />
              </Text>
              {userProfile?.isBot ? null : (
                <Text pt="2" fontSize="sm">
                  Likes: {userProfile?.nrOfLikes}
                </Text>
              )}
              <Text pt="2" fontSize="sm">
                {userProfile?.isBot ? "Subscribers" : "Friends"}: {userProfile?.friends.length}
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
                  {userProfile?.isBot ? "Subscribed" : "Friend"}
                </Badge>
              ) : (
                <BefriendButton
                  hasFriendRequest={hasFriendRequest}
                  username={userProfile?.username ?? ""}
                  isChannel={userProfile?.isBot}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
