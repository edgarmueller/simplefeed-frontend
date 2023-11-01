import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPost } from "../api/posts";
import { Layout } from "../components/common/Layout";
import { Post as PostEntity } from "../domain.interface";
import { Post } from "../components/posts/Post";

const PostPage = () => {
	const { id: postId } = useParams();
	const [post, setPost] = useState<PostEntity>()
  useEffect(() => {
		if (!postId) {
			return;
		}
		fetchPost(postId).then((post) => {
			setPost(post)
		});
	}, []);
  return (
    <Layout>
			{
				post ? <Post post={post} /> : null
			}
    </Layout>
  );
};

export default PostPage;
