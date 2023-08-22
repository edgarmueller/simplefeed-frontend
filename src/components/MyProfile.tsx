import {
  Avatar,
  Card,
  CardBody,
  Heading,
  Link,
  Stack,
  Text
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../lib/auth/hooks/useUser";

export const MyProfile = ({
  small,
}: any) => {
  const { user } = useUser();
  const userProfile = user;

  if (small) {
    return (
      <Stack direction="row" align="center">
        <Avatar src={userProfile?.imageUrl} size="lg"/>
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
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};
