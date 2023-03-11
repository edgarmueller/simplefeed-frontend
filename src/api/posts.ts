import { Pagination, Post } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

const fetchOne = fetch<Post>();
const fetchMany = fetch<Pagination<Post>>();

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
