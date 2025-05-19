import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try{
      const resp = await fetch("/api/posts",{cache: "no-store"});
      if (resp.status !== 200) {
        setError("Failed to fetch posts");
        setLoading(false);
        return;
      }
      
      const postsResp = await resp.json();
      if(!postsResp || postsResp.length === 0) {
        setError("No posts found");
        setLoading(false);
        return;
      }
      setPosts(postsResp);
      }catch (error) {
        console.error("Error fetching posts:", error);
        setError("An error occurred while fetching posts");
      }finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
       <div key={post.id}>
          <h2>
            {post.nom}
            {post.prix} €
            {post.categorie}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default Posts;