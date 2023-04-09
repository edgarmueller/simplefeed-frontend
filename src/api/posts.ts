import { Comment, Pagination, Post } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

// TODO
const fetchOne = fetch<Post>();
const fetchMany = fetch<Pagination<Post>>();
const fetchOneComment = fetch<Comment>();
// TODO pagination
const fetchManyComments = fetch<Pagination<Comment>>();

export async function submitPost(body: string) {
  const res = await fetchOne(`${API_URL}/posts`, {
    headers: {
      ...createHeaders(),
    },
    method: "POST",
    body: JSON.stringify({ body }),
  });
  return res.body;
}

export async function fetchPosts(page: number): Promise<Pagination<Post>> {
  const res = await fetchMany(`${API_URL}/posts?page=${page}&limit=5`, {
    headers: {
      ...createHeaders(),
    },
  });
  return res.body;
}

export async function postComment(
  postId: string,
  content: string,
  path: string | undefined
): Promise<Comment> {
  const res = await fetchOneComment(`${API_URL}/posts/${postId}/comments`, {
    headers: {
      ...createHeaders(),
    },
    method: "POST",
    body: JSON.stringify({ content, path }),
  });
  return res.body;
}

export interface CommentNode {
  comment: Comment;
  children: CommentNode[];
}

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const commentMap = new Map<string, CommentNode>();

  // First pass: create a CommentNode for each comment
  for (const comment of comments) {
    commentMap.set(comment.id, {
      comment,
      children: [],
    });
  }

  // Second pass: link CommentNodes based on their paths
  for (const comment of comments) {
    const path = comment.path.split("/");
    if (path.length > 1) {
      const parentId = path[path.length - 1];
      const parent = commentMap.get(parentId);
      console.log({ parentId, parent });
      if (parent) {
        parent.children.push(commentMap.get(comment.id)!);
      }
    }
  }

  // Return the root nodes (comments with no parents)
  return Array.from(commentMap.values()).filter((node) => {
    const path = node.comment.path.split("/");
    return path.length === 1;
  });
}

export async function fetchComments(
  postId: string,
  page = 1,
  commentId = postId
): Promise<Comment[]> {
  // TODO: hard coded limit
  const url = commentId
    ? `${API_URL}/posts/${postId}/comments/${commentId}?page=${page}&limit=3`
    : `${API_URL}/posts/${postId}/comments?page=${page}&limit=3`;
  const res = await fetchManyComments(url, {
    headers: {
      ...createHeaders(),
    },
  });
  return res.body.items;
}
