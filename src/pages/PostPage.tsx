import { useLoaderData, defer, Await } from "react-router-dom";
import { fetchPost } from "../api/posts";
import { Layout } from "../components/common/Layout";
import { Post as PostEntity } from "../model/domain.interface";
import { Post } from "../components/posts/Post";
import React from "react";

export async function loader({ params }: any) {
	return defer({ post: fetchPost(params.postId) })
}

const PostPage = () => {
	const data = useLoaderData() as { post: PostEntity };
	return (
		<Layout>
			<React.Suspense
				fallback={<p>Loading post...</p>}
			>
				<Await
					resolve={data.post}
					errorElement={
						<p>Error loading post!</p>
					}
				>
					{(post) => <Post post={post} showComments />}
				</Await>
			</React.Suspense>
		</Layout>
	);
};

export default PostPage;
