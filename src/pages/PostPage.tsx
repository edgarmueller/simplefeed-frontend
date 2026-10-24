import { Await, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { fetchPost } from "../api/posts";
import { Layout } from "../components/common/Layout";
import { Post as PostEntity } from "../model/domain.interface";
import { Post } from "../components/posts/Post";
import React from "react";

export function loader({ params }: LoaderFunctionArgs) {
	// returning the promise unawaited lets the page render while the post loads
	return { post: fetchPost(params.postId!) }
}

const PostPage = () => {
	const data = useLoaderData<typeof loader>();
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
					{(post: PostEntity) => <Post post={post} showComments />}
				</Await>
			</React.Suspense>
		</Layout>
	);
};

export default PostPage;
