import axios from "axios";
import { Comment, Pagination } from "../model/domain.interface";
import { API_URL } from "./constants";
import { createHeaders } from "../lib/axios";

export async function submitComment({ postId, content, path }: {
  postId: string,
  content: string,
  path: string | undefined
}): Promise<Comment> {
  const res = await axios.post(
    `${API_URL}/posts/${postId}/comments`,
    { content, path: `${postId}/${path}` },
    {
      headers: createHeaders(),
    }
  );
  return res.data;
}

export const COMMENTS_FETCH_LIMIT = 20;

export async function fetchComments(
  postId: string,
  page = 1,
  commentId = postId
): Promise<Pagination<Comment>> {
  // TODO: hard coded limit
  const limit = COMMENTS_FETCH_LIMIT;
  const url = commentId
    ? `${API_URL}/posts/${postId}/comments/${commentId}?page=${page}&limit=${limit}`
    : `${API_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`;
  const res = await axios.get(url, {
    headers: createHeaders(),
  });
  return res.data;
}