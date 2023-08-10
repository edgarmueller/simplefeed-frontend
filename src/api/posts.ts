import { Comment, Pagination, Post } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import axios, { createHeaders } from "../lib/axios";

export async function submitPost(post: any) {
  const res = await axios.post(`${API_URL}/posts`, post, {
    headers: createHeaders(),
  });
  return res.data;
}

export async function fetchFeed(
  page?: number,
  limit = 1
): Promise<Pagination<Post>> {
  const res = await axios.get(`${API_URL}/posts?page=${page}&limit=${limit}`, {
    headers: createHeaders(),
  });
  return res.data;
}

export function fetchPosts(userId: string) {
  return async (page?: number, limit = 50): Promise<Pagination<Post>> => {
    const res = await axios.get(
      `${API_URL}/posts?userId=${userId}&page=${page}&limit=${limit}`,
      {
        headers: createHeaders(),
      }
    );
    return res.data;
  };
}

export async function fetchPost(postId: string): Promise<Post> {
  const res = await axios.get(`${API_URL}/posts/${postId}`, {
    headers: createHeaders(),
  });
  return res.data;
}

export async function postComment(
  postId: string,
  content: string,
  path: string | undefined
): Promise<Comment> {
  const res = await axios.post(
    `${API_URL}/posts/${postId}/comments`,
    { content, path: `${postId}/${path}` },
    {
      headers: createHeaders(),
    }
  );
  return res.data;
}

export async function likePost(postId: string): Promise<void> {
  await axios.post(`${API_URL}/posts/${postId}/like`, {
    headers: createHeaders(),
  });
}

export async function unlikePost(postId: string): Promise<void> {
  await axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: createHeaders(),
    method: "DELETE",
  });
}

export async function deletePost(postId: string): Promise<void> {
  await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: createHeaders(),
  });
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
    const path = comment.path?.split("/");
    if (path.length > 1) {
      const parentId = path[path.length - 1];
      const parent = commentMap.get(parentId);
      if (parent) {
        parent.children.push(commentMap.get(comment.id)!);
      }
    }
  }

  // Return the root nodes (comments with no parents)
  return Array.from(commentMap.values()).filter((node) => {
    const path = node.comment.path?.split("/");
    return path.length === 1;
  });
}

export async function fetchComments(
  postId: string,
  page = 1,
  commentId = postId
): Promise<Pagination<Comment>> {
  // TODO: hard coded limit
  const limit = 50;
  const url = commentId
    ? `${API_URL}/posts/${postId}/comments/${commentId}?page=${page}&limit=${limit}}`
    : `${API_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`;
  const res = await axios.get(url, {
    headers: createHeaders(),
  });
  return res.data;
}
