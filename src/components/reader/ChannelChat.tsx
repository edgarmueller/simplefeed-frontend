import { Box, Button, Card, Input, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchMessages, sendMessage } from "../../api/reader";
import { Preferences, Subscription } from "../../model/domain.interface";
import { notifyError } from "../ui/toaster";

/** how often to look for the channel's answer */
const ANSWER_POLL_MS = 1500;

const describe = (preferences: Preferences) =>
  [
    ["Favoring", preferences.interests.join(", ") || "nothing in particular"],
    ["Leaving out", preferences.muted.join(", ") || "nothing"],
    ["Per day", `at most ${preferences.maxPostsPerDay} stories`],
    ...(preferences.notes ? [["Notes", preferences.notes]] : []),
  ] as const;

/** The reader's chat with a channel: tell it what to pick, and see what it does now. */
export const ChannelChat = ({ subscription }: { subscription: Subscription }) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const messages = useQuery({
    queryKey: ["messages", subscription.id],
    queryFn: () => fetchMessages(subscription.id),
    // poll only while the channel hasn't answered the last message
    refetchInterval: (query) => (query.state.data?.at(-1)?.author === "reader" ? ANSWER_POLL_MS : false),
  });
  const waiting = messages.data?.at(-1)?.author === "reader";
  const lastAnswer = messages.data?.findLast((message) => message.author === "channel")?.id;
  useEffect(() => {
    // the answer may have changed the preferences shown next to the chat
    if (lastAnswer) queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  }, [lastAnswer, queryClient]);
  useEffect(() => {
    bottom.current?.scrollIntoView?.({ block: "nearest" });
  }, [messages.data?.length]);
  const send = useMutation({
    mutationFn: (content: string) => sendMessage(subscription.id, content),
    onSuccess: async () => {
      setDraft("");
      await queryClient.invalidateQueries({ queryKey: ["messages", subscription.id] });
    },
    onError: (error: Error) => notifyError("Sending the message", error),
  });

  return (
    <Stack gap={4}>
      <Card.Root variant="subtle" size="sm">
        <Card.Body>
          {describe(subscription.preferences).map(([label, value]) => (
            <Text key={label} fontSize="sm">
              <Text as="span" color="fg.muted">
                {label}:
              </Text>{" "}
              {value}
            </Text>
          ))}
        </Card.Body>
      </Card.Root>
      <Stack gap={2} maxH="50vh" overflowY="auto">
        {messages.data?.length === 0 ? (
          <Text color="fg.muted">
            Tell {subscription.channel.name ?? "the channel"} what you want, e.g. "mute crypto", "more rust" or "max 5 per day".
          </Text>
        ) : null}
        {messages.data?.map((message) => (
          <Box
            key={message.id}
            alignSelf={message.author === "reader" ? "flex-end" : "flex-start"}
            bg={message.author === "reader" ? "blue.subtle" : "bg.muted"}
            rounded="xl"
            px={3}
            py={2}
            maxW="80%"
            whiteSpace="pre-line"
          >
            {message.content}
          </Box>
        ))}
        {waiting ? (
          <Text fontSize="sm" color="fg.muted">
            {subscription.channel.name ?? "The channel"} is typing…
          </Text>
        ) : null}
        <div ref={bottom} />
      </Stack>
      <Box
        as="form"
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          if (draft.trim()) send.mutate(draft.trim());
        }}
      >
        <Stack direction="row" gap={2}>
          <Input placeholder="Type a message" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <Button type="submit" loading={send.isPending} disabled={!draft.trim()}>
            Send
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
