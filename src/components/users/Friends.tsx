import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack
} from "@chakra-ui/react";
import { removeFriend } from "../../api/friends";
import { useUser } from "../../lib/auth/hooks/useUser";
import { Layout } from "../Layout";
import { UserDetailSmall } from "../UserDetailSmall";
import { FriendList } from "./FriendList";
import { ReceivedFriendRequests } from "./ReceivedFriendRequests";
import { SentFriendRequests } from "./SentFriendRequests";

export const Friends = () => {
  const { user, refresh: refreshUser } = useUser();
  return (
    <Layout>
      <Card variant="outline">
        <CardBody>
          <Stack spacing="4">
            <ReceivedFriendRequests />
            <SentFriendRequests />
          </Stack>
        </CardBody>
      </Card>
      <Card variant="outline" mt={4}>
        <CardBody>
          <Heading size="sm" textTransform="uppercase">
            Friends
          </Heading>
          <FriendList
            friends={user?.friends || []}
            renderFriend={(friend) => (
              <>
                <UserDetailSmall user={friend} asLink />
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="xs"
                  onClick={async () => {
                    await removeFriend(friend.id);
                    await refreshUser();
                  }}
                >
                  Remove
                </Button>
              </>
            )}
            ifEmpty={<>No friends</>}
          />
        </CardBody>
      </Card>
    </Layout>
  );
};
