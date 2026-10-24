import { Tabs } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  redirect,
  type LoaderFunctionArgs,
  useLoaderData,
  useLocation,
  useParams,
} from "react-router";
import { getSentFriendRequests } from "../api/friends";
import { fetchUser } from "../api/user";
import { Layout } from "../components/common/Layout";
import { SubmitForm } from "../components/posts/SubmitForm";
import { UserDetail } from "../components/users/UserDetail";
import Chat from "../components/chat/Chat";
import { PostList } from "../components/posts/PostList";
import { Conversation, User } from "../model/domain.interface";
import { FriendList } from "../components/users/FriendList";
import { UserDetailSmall } from "../components/users/UserDetailSmall";
import { useChatStore } from "../stores/useChatStore";
import { useUserStore } from "../stores/useUserStore";

export async function loader({ params }: LoaderFunctionArgs): Promise<User | Response> {
  try {
    return await fetchUser(params.username!);
  } catch {
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
  const { user: myself, setUser } = useUserStore();
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
      <Tabs.Root
        variant="enclosed"
        marginTop={4}
        defaultValue={showChat ? "chat" : "posts"}
      >
        <Tabs.List>
          <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
          <Tabs.Trigger value="friends">Friends</Tabs.Trigger>
          {isMyProfile ? null : <Tabs.Trigger value="chat">Chat</Tabs.Trigger>}
        </Tabs.List>
        <Tabs.Content value="posts">
            <SubmitForm
              onSubmit={async () => {
                if (myself && isMyProfile) {
                  setUser({ ...myself, nrOfPosts: myself.nrOfPosts + 1 });
                }
                await queryClient.invalidateQueries({ queryKey: ["posts", userId] });
              }}
              postTo={userId}
            />
            <PostList userId={userId} />
        </Tabs.Content>
        <Tabs.Content value="friends">
            <FriendList
              friends={user.friends}
              ifEmpty={<>"No friends yet!"</>}
              renderFriend={(friend) => {
                return <UserDetailSmall user={friend} />
              }}
            />
        </Tabs.Content>
          {
            !isMyProfile && conversationId ? (
              <Tabs.Content value="chat">
                <Chat
                  friend={{ id: user.id, username: user.username }}
                  conversationId={conversationId}
                />
              </Tabs.Content>) : null
          }
      </Tabs.Root>
    </Layout>
  );
};

export default UserProfile;
