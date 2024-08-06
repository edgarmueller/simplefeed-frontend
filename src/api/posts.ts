import { Pagination, Post } from "../model/domain.interface";
import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

export type SubmitPostDto = {
  body: string;
  toUserId: string | undefined;
  attachments: any[];
};

export async function fetchFeed(
  page?: number,
  limit = 10
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

export async function submitPost(post: SubmitPostDto): Promise<Post> {
  const formData = new FormData();
  post.attachments
    .filter(({ type }: any) => type === "image")
    .forEach(({ image }: any, index: number) => {
      formData.append(`image_${index}`, image);
    });
  formData.append("body", post.body);
  formData.append("attachments", JSON.stringify(post.attachments));
  if (post.toUserId) {
    formData.append("toUserId", post.toUserId);
  }
  const res = await axios.post(`${API_URL}/posts`, formData, {
    headers: {
      ...createHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function likePost(postId: string): Promise<void> {
  await axios.post(`${API_URL}/posts/${postId}/like`, undefined, {
    headers: createHeaders(),
  });
}

export async function unlikePost(postId: string): Promise<void> {
  await axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: createHeaders(),
  });
}

export async function deletePost(postId: string): Promise<void> {
  await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: createHeaders(),
  });
}
