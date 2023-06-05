import {
  Avatar,
  Box,
  Card,
  CardBody,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Profile } from "../domain.interface";
import { BefriendButton } from "./BefriendButton";

export const UserDetail = ({
  user,
  username,
  small,
  hasFriendRequest,
  isFriend,
}: any) => {
  const [userProfile, setUserProfile] = useState<Profile | null>(user || null);

  useEffect(() => {
    setUserProfile(user);
  }, [username, user]);

  if (small) {
    return (
      <Stack direction="row" align="center">
        <Avatar src={userProfile?.imageUrl} borderRadius="lg" />
        <Link as={RouterLink} to={`/users/${userProfile?.username}`}>
          {userProfile?.firstName} {userProfile?.lastName}
        </Link>
      </Stack>
    );
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
