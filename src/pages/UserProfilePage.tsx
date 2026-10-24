import { Tabs, Text } from "@chakra-ui/react";
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
import { useChat } from "../hooks/useChat";
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

const CONVERSATION_LOOKUP_ATTEMPTS = 5;
const CONVERSATION_LOOKUP_DELAY_MS = 1000;

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
  const { fetchConversations, joinConversation } = useChat();

  // accepting a friend request creates the conversation in the background, so
  // it can be missing when the acceptance arrives; keep looking for a while
  useEffect(() => {
    if (!isFriend || isMyProfile || conversationId) {
      return;
    }
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const lookup = async (attempt: number) => {
      const fetched = await fetchConversations().catch(() => [] as Conversation[]);
      if (cancelled) return;
      fetched.forEach((conversation) => joinConversation(conversation.id));
      if (!findConversationId(fetched, userId) && attempt < CONVERSATION_LOOKUP_ATTEMPTS) {
        timeout = setTimeout(() => lookup(attempt + 1), CONVERSATION_LOOKUP_DELAY_MS);
      }
    };
    lookup(1);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isFriend, isMyProfile, conversationId, userId, fetchConversations, joinConversation]);

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
          <Tabs.Trigger value="friends">{user.isBot ? "Subscribers" : "Friends"}</Tabs.Trigger>
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
          {isMyProfile ? null : (
            <Tabs.Content value="chat">
              {conversationId ? (
                <Chat friend={{ id: user.id, username: user.username }} conversationId={conversationId} />
              ) : (
                <Text color="fg.muted">
                  {isFriend
                    ? "Starting the conversation…"
                    : user.isBot
                      ? `Subscribe to ${user.firstName} to chat.`
                      : `Become friends with ${user.firstName} to chat.`}
                </Text>
              )}
            </Tabs.Content>
          )}
      </Tabs.Root>
    </Layout>
  );
};

export default UserProfile;
