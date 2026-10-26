import { Box, Card, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BiBookmark, BiCheckCircle, BiLike, BiSolidBookmark, BiSolidCheckCircle, BiSolidLike } from "react-icons/bi";
import { Link as RouterLink } from "react-router";
import { markEntry } from "../../api/reader";
import { formatTimeAgo } from "../../lib/time-ago";
import { Entry } from "../../model/domain.interface";
import { notifyError } from "../ui/toaster";

/** the longest excerpt shown in place of a summary */
const MAX_EXCERPT = 240;

const shorten = (text: string) => {
  if (text.length <= MAX_EXCERPT) return text;
  const cut = text.slice(0, MAX_EXCERPT - 1);
  const space = cut.lastIndexOf(" ");
  return `${space > MAX_EXCERPT / 2 ? cut.slice(0, space) : cut}…`;
};

type State = { read: boolean; liked: boolean; saved: boolean };

/**
 * One story in the reader's feed. Marking it stays visible until the feed
 * reloads, so the reader can undo it.
 */
export const EntryCard = ({ entry }: { entry: Entry }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<State>({ read: !!entry.readAt, liked: !!entry.likedAt, saved: !!entry.savedAt });
  const mark = useMutation({
    mutationFn: (change: Partial<State>) => markEntry(entry.id, change),
    onMutate: (change) => setState((current) => ({ ...current, ...change })),
    onSuccess: (_, change) => {
      if (change.read !== undefined) queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error: Error, change) => {
      setState((current) => ({ ...current, ...Object.fromEntries(Object.entries(change).map(([key, value]) => [key, !value])) }));
      notifyError("Updating the story", error);
    },
  });
  const { item, channel } = entry;
  const text = entry.summary ?? (item.excerpt ? shorten(item.excerpt) : undefined);
  const about = [
    item.score !== undefined ? `▲ ${item.score} points` : undefined,
    item.sourceName && item.sourceName !== channel.name ? item.sourceName : undefined,
    item.domain,
  ].filter(Boolean);

  return (
    <Card.Root as="article" variant="outline" marginBottom={3} opacity={state.read ? 0.6 : 1} _hover={{ borderColor: "border.emphasized" }}>
      <Card.Body gap={2} padding={4}>
        <Text fontSize="sm" color="fg.muted">
          <Link asChild fontWeight="medium" color="fg">
            <RouterLink to={`/channels/${channel.id}`}>{channel.name ?? "Channel"}</RouterLink>
          </Link>
          {" · "}
          {formatTimeAgo(entry.pickedAt)}
        </Text>
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          fontSize="lg"
          fontWeight="semibold"
          lineHeight="short"
          color="fg"
          onClick={() => !state.read && mark.mutate({ read: true })}
        >
          {item.title}
        </Link>
        {text ? <Text lineHeight="tall">{text}</Text> : null}
        <Stack direction="row" justify="space-between" align="center">
          <Text fontSize="sm" color="fg.muted">
            {about.join(" · ")}
            {item.discussionUrl ? (
              <>
                {" · "}
                <Link href={item.discussionUrl} target="_blank" rel="noopener noreferrer" color="fg.muted" textDecoration="underline">
                  {item.comments ?? 0} comments
                </Link>
              </>
            ) : null}
          </Text>
          <Box>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label={state.liked ? "Unlike" : "Like"}
              title={state.liked ? "Unlike" : "Like: the channel picks more like this"}
              onClick={() => mark.mutate({ liked: !state.liked })}
            >
              {state.liked ? <BiSolidLike /> : <BiLike />}
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label={state.saved ? "Unsave" : "Save"}
              title={state.saved ? "Remove from saved" : "Save for later"}
              onClick={() => mark.mutate({ saved: !state.saved })}
            >
              {state.saved ? <BiSolidBookmark /> : <BiBookmark />}
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label={state.read ? "Mark unread" : "Mark read"}
              title={state.read ? "Mark unread" : "Mark read"}
              onClick={() => mark.mutate({ read: !state.read })}
            >
              {state.read ? <BiSolidCheckCircle /> : <BiCheckCircle />}
            </IconButton>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
