import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import "../styles/SingleCategory.css"; // Import the CSS file for styling
import img1 from "../assets/images/img1.png";
import img2 from "../assets/images/img2.png";

function SingleCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data for posts (ensure posts have a 'categoryId' field for filtering)
  const posts = [
    {
      id: 1,
      title: "Tech Post 1",
      body: "This is a tech post body by John Doe.",
      image: img1,
      categoryId: 1,
    },
    {
      id: 2,
      title: "Science Post 1",
      body: "This is a science post body by John Doe.",
      image: img2,
      categoryId: 2,
    },
  ];

  // Filter posts based on category ID
  const filteredPosts = posts.filter(
    (post) => post.categoryId === parseInt(id)
  );

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="single-category-container">
      <h1>Posts in Category {id}</h1>
      <div className="post-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              onClick={() => handlePostClick(post.id)}
            >
              <PostCard
                title={post.title}
                body={post.body}
                image={post.image}
              />
            </div>
          ))
        ) : (
          <p>No posts found for this category.</p>
        )}
      </div>
    </div>
  );
}

export default SingleCategory;
