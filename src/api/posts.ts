import { Pagination, Post, Comment } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

// TODO
const fetchOne = fetch<Post>();
const fetchMany = fetch<Pagination<Post>>();
const fetchOneComment = fetch<Comment>();
// TODO pagination
const fetchManyComments = fetch<Pagination<Comment>>();

export async function submitPost(body: string) {
  const res = await fetchOne(
    `${API_URL}/posts`,
    {
      headers: {
        ...createHeaders(),
      },
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );
  return res.body;
}

export async function fetchPosts(page: number): Promise<Pagination<Post>> {
  const res = await fetchMany(
    `${API_URL}/posts?page=${page}&limit=5`,
    {
      headers: {
        ...createHeaders(),
      },
    },
  );
  return res.body;
}

export async function postComment(postId: string, content: string, path: string = ''): Promise<Comment> {
  const res = await fetchOneComment(
    `${API_URL}/posts/${postId}/comments`,
    {
      headers: { 
        ...createHeaders(),
      },
      method: "POST",
      body: JSON.stringify({ content, path }),
    },
  );
  return res.body;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await fetchManyComments(
    `${API_URL}/posts/${postId}/comments`,
    {
      headers: {
        ...createHeaders(),
      },
    },
  );
  return res.body.items;
}

export async function fetchReplies(postId: string, commentId: string): Promise<Comment[]> {
  const res = await fetchManyComments(
    `${API_URL}/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        ...createHeaders(),
      },
    },
  );
  return res.body.items;
}