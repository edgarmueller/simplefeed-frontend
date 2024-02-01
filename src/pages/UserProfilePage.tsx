import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  redirect,
  useLoaderData,
  useLocation,
  useParams,
} from "react-router-dom";
import { getSentFriendRequests } from "../api/friends";
import { fetchUser } from "../api/user";
import { Layout } from "../components/common/Layout";
import { SubmitForm } from "../components/posts/SubmitForm";
import { UserDetail } from "../components/users/UserDetail";
import Chat from "../components/chat/Chat";
import { PostList } from "../components/posts/PostList";
import { Conversation, User } from "../domain.interface";
import { useUser } from "../hooks/useUser";
import { FriendList } from "../components/users/FriendList";
import { UserDetailSmall } from "../components/users/UserDetailSmall";
import { useChatStore } from "../hooks/useChatStore";

export async function loader({ params }: any): Promise<User | Response> {
  try {
    return await fetchUser(params.username);
  } catch (error) {
    return redirect("/sign-in");
  }
}

const findConversationId = (conversations: Conversation[], userId: string) => {
  return conversations?.find((conversation) =>
    conversation.userIds?.some(
      (participantId) => participantId === userId
    )
  )?.id;
}

const UserProfile = () => {
  const params = useParams();
  const location = useLocation();
  const showChat = location.pathname.includes("/chat");
  const { user: myself, setUser: setMyUser } = useUser();
  const isMyProfile = params.username === myself?.username;
  const user = useLoaderData() as User;
  const queryClient = useQueryClient();
  const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);
  const conversations = useChatStore(s => s.conversations);
  const conversationId = findConversationId(conversations, user?.id);
  const userId = user?.id;
  const isFriend =
    isMyProfile || !!myself?.friends?.find(({ id }) => id === user?.id)

  useEffect(() => {
    if (!isMyProfile) {
      getSentFriendRequests().then((friendRequests) => {
        setFriendRequestSent(friendRequests.some((fr) => fr.to.id === userId));
      });
    }
  }, [isMyProfile, userId]);

  return (
    <Layout>
      <UserDetail
        isMyself={isMyProfile}
        user={isMyProfile ? myself : user}
        isFriend={isFriend}
        hasFriendRequest={friendRequestSent}
      />
      <Tabs
        variant="soft-rounded"
        marginTop={4}
        colorScheme="blackAlpha"
        defaultIndex={showChat ? 2 : 0}
        onChange={(index) => { /* setTabIndex(index) */ }}
      >
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Friends</Tab>
          {isMyProfile ? null : <Tab>Chat</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <SubmitForm
              onSubmit={async () => {
                setMyUser({ ...user, nrOfPosts: user.nrOfPosts + 1 });
                await queryClient.refetchQueries([
                  "posts",
                  "infinite",
                  userId,
                ])
              }}
              postTo={userId}
            />
            <PostList userId={userId} />
          </TabPanel>
          <TabPanel>
            <FriendList
              friends={user.friends}
              ifEmpty={<>"No friends yet!"</>}
              renderFriend={(friend) => {
                return <UserDetailSmall user={friend} />
              }}
            />
          </TabPanel>
          {
            !isMyProfile && conversationId ? (
              <TabPanel>
                <Chat
                  friend={{ id: user.id, username: user.username }}
                  conversationId={conversationId}
                />
              </TabPanel>) : null
          }
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default UserProfile;
