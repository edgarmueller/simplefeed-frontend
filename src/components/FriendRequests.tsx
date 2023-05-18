import { useEffect, useState } from "react";
import { acceptFriendRequest, fetchFriendsOfUser, getFriendRequests } from "../api/friend-requests";
import { FriendRequest, User } from "../domain.interface";
import { Button, Card, CardHeader, CardBody, Text } from "@chakra-ui/react";
import { Layout } from "./Layout";
import { useUser } from "../lib/auth/hooks/useUser";

export const FriendRequests = () => {
	const { user } = useUser()
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  useEffect(() => {
    getFriendRequests().then((friendRequests) => {
      setFriendRequests(friendRequests);
    });
		if (user?.username) {
			fetchFriendsOfUser(user?.username).then((friendsOfUser) => {
				console.log({ friendsOfUser })
				setFriends(friendsOfUser)
			})
		}
  }, [user]);

  return (
    <Layout>
      <Card>
				<CardHeader>
					<Text as='b'>Received friend requests</Text>
				</CardHeader>
        <CardBody>
          {friendRequests.length === 0
            ? "No friend requests"
            : friendRequests.map((friendRequest) => (
                <>
                  <div key={friendRequest.id}>{friendRequest.id}</div>
                  <Button onClick={() => acceptFriendRequest(friendRequest.id)}>
                    Accept
                  </Button>
                </>
              ))}
        </CardBody>
      </Card>
      <Card>
				<CardHeader>
					<Text as='b'>Sent friend requests</Text>
				</CardHeader>
        <CardBody>
          {friendRequests.length === 0
            ? "No friend requests"
            : friendRequests.map((friendRequest) => (
                <>
                  <div key={friendRequest.id}>{friendRequest.id}</div>
                  <Button onClick={() => acceptFriendRequest(friendRequest.id)}>
                    Accept
                  </Button>
                </>
              ))}
        </CardBody>
      </Card>
			<Card>
				<CardHeader>
					<Text as='b'>Friends</Text>
				</CardHeader>
				<CardBody>
					{friends.length === 0 ? "No friends" : friends.map((friend) => (
						<div key={friend.id}>{friend.username}</div>
					))}
				</CardBody>
			</Card>
    </Layout>
  );
};
