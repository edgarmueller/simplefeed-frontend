import { useEffect, useState } from "react";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { fetchPosts } from "../../api/posts";
import { Post } from "../../domain.interface";
import "./PostList.css";
import Avatar from "react-avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import { uniqBy } from "lodash"

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

export const PostList = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetchPosts(pageNumber).then((page) => {
      setPosts(p => uniqBy([...p, ...page.items], 'id'));
      setHasMore(page.meta.totalPages !== pageNumber)//page.meta.currentPage)
    });
  }, [pageNumber])
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={() => setPageNumber(pageNumber + 1)}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {posts.map((post) => {
				const postedTo = post.postedTo
        return (
          <div key={post.id} className="status_post">
            <div className="profile_pic">
              <Avatar 
                size="50"
                round
                name={post.author.profile?.username} 
                src={post.author.profile?.imageUrl} />
            </div>
            <div className="posted_by" style={{ color: "#ACACAC" }}>
              <a href={post.author.profile.username}>
                {post.author.profile.firstName} {post.author.profile.lastName}
              </a>{" "}
							{post.postedTo && "to "}
							{post.postedTo &&
								<a href={postedTo.profile.username}>
									{post.postedTo.profile.firstName} {post.postedTo.profile.lastName}
								</a>
							}
            </div>
            <div className="posted_at">{timeAgo.format(Date.parse(post.createdAt))}</div>
            <div className="post_content">
              <p>{post.body}</p>
            </div>
            <hr />
          </div>
        );
      })}
    </InfiniteScroll>
  );
};
