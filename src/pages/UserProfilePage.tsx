import { Tabs, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  redirect,
  type LoaderFunctionArgs,
  useLoaderData,
  useLocation,
  useParams,
} from "react-router";
import { fetchUser } from "../api/user";
import { Layout } from "../components/common/Layout";
import { SubmitForm } from "../components/posts/SubmitForm";
import { UserDetail } from "../components/users/UserDetail";
import Chat from "../components/chat/Chat";
import { PostList } from "../components/posts/PostList";
import { Conversation, User } from "../model/domain.interface";
import { useIsSubscribed } from "../hooks/useIsSubscribed";
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
  const conversations = useChatStore(s => s.conversations);
  const conversationId = findConversationId(conversations, user?.id);
  const userId = user?.id;
  const isChannel = !!user?.isBot;
  const isSubscribed = useIsSubscribed(user?.id);
  const { fetchConversations, joinConversation } = useChat();

  // subscribing creates the conversation in the background, so it can be
  // missing right after subscribing; keep looking for a while
  useEffect(() => {
    if (!isSubscribed || conversationId) {
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
  }, [isSubscribed, conversationId, userId, fetchConversations, joinConversation]);

  return (
    <Layout>
      <UserDetail
        isMyself={isMyProfile}
        user={isMyProfile ? myself : user}
      />
      <Tabs.Root
        variant="enclosed"
        marginTop={4}
        defaultValue={showChat ? "chat" : "posts"}
      >
        <Tabs.List>
          <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
          {isChannel ? <Tabs.Trigger value="chat">Chat</Tabs.Trigger> : null}
        </Tabs.List>
        <Tabs.Content value="posts">
          {isMyProfile ? (
            <SubmitForm
              onSubmit={async () => {
                if (myself) {
                  setUser({ ...myself, nrOfPosts: myself.nrOfPosts + 1 });
                }
                await queryClient.invalidateQueries({ queryKey: ["posts", userId] });
              }}
              postTo={userId}
            />
          ) : null}
          <PostList userId={userId} />
        </Tabs.Content>
        {isChannel ? (
          <Tabs.Content value="chat">
            {conversationId ? (
              <Chat channel={{ id: user.id, username: user.username }} conversationId={conversationId} />
            ) : (
              <Text color="fg.muted">
                {isSubscribed
                  ? "Starting the conversation…"
                  : `Subscribe to ${user.firstName} ${user.lastName} to tune what it posts.`}
              </Text>
            )}
          </Tabs.Content>
        ) : null}
      </Tabs.Root>
    </Layout>
  );
};

export default UserProfile;
