import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { redirect, useLoaderData, useLocation, useParams } from "react-router-dom";
import { getSentFriendRequests } from "../api/friend-requests";
import { fetchUserProfile } from "../api/profile";
import { Layout } from "../components/Layout";
import { SubmitForm } from "../components/SubmitForm";
import { UserDetail } from "../components/UserDetail";
import { PostList } from "../components/posts/PostList";
import { User } from "../domain.interface";
import { useUser } from "../lib/auth/hooks/useUser";
import { MyProfile } from "../components/MyProfile";
import Chat from "../components/chat/Chat";
import { useChat } from "../components/chat/useChat";

export async function loader({ params }: any): Promise<User | Response> {
  try {
    return await fetchUserProfile(params.username);
  } catch (error) {
    return redirect("/sign-in");
  }
}

const UserProfile = () => {
  const params = useParams();
  const location = useLocation();
  const showChat = location.pathname.includes('/chat');
  const { user: myself, incrementPostCount } = useUser();
  const isMyProfile = params.username === myself?.username;
  const [postRefreshCount, setPostRefreshCount] = useState(0);
  const user = useLoaderData() as User;
  const [isFriend, setIsFriend] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const isBefriended =
      isMyProfile || !!myself?.friends?.find(({ id }) => id === user?.id);
    setIsFriend(isBefriended);
    setUserId(user?.id);
  }, [isMyProfile, myself, setIsFriend, user]);
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);
  const { conversations } = useChat()
  const conversationId = conversations?.find((conversation) =>
    conversation.participantIds?.some(
      (participantId) => participantId === user?.id
    )
  )?.id;
  useEffect(() => {
    getSentFriendRequests().then((friendRequests) => {
      setFriendRequestSent(friendRequests.some((fr) => fr.to.id === userId));
    });
  }, []);
  return (
    <Layout>
      {isMyProfile ? (
        <MyProfile />
      ) : (
        <UserDetail
          user={user}
          isFriend={isFriend}
          hasFriendRequest={friendRequestSent}
        />
      )}
      {isMyProfile ? null : (
        <Tabs
          variant="soft-rounded"
          marginTop={4}
          colorScheme="blackAlpha"
          defaultIndex={showChat ? 1 : 0}
        >
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Chat</Tab>
            <Tab>Friends</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SubmitForm
                onSubmit={() => {
                  setPostRefreshCount((cnt) => cnt + 1);
                  incrementPostCount();
                }}
                postTo={userId}
              />
              <PostList key={postRefreshCount} userId={userId} />
            </TabPanel>
            <TabPanel>
              {conversationId ? (
                <Chat
                  friend={{ id: user.id, username: user.username }}
                  conversationId={conversationId}
                />
              ) : null}
            </TabPanel>
            <TabPanel>
              {user.friends.length === 0
                ? "No friends"
                : user.friends.map((friend) => (
                    <UserDetail key={friend.id} user={friend} small />
                  ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Layout>
  );
};

export default UserProfile;
