import React from "react";
import { Link } from "react-router-dom";
import "../styles/PostCard.css";

// Function to dynamically import images
const getImage = (imageName) => {
  try {
    return require(`../assets/images/${imageName}`);
  } catch (err) {
    console.error(`Image not found: ${imageName}`);
    return require(`../assets/images/default.png`);
  }
};

function PostCard({ id, title, body, image, rating, user, created_at }) {
  const imageUrl = getImage(image);

  // Format date as day-month-year
  const formattedDate = new Date(created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Link to={`/post/${id}`} className="post-card-link">
      <div className="post-card">
        <div className="post-image-container">
          <img src={imageUrl} alt={title} className="post-image" />
        </div>
        <div className="post-content">
          <h3 className="post-title">{title}</h3>
          <p className="post-body">{body}</p>
          <p className="post-user">Added by: {user}</p>
          <p className="post-date">Created on: {formattedDate}</p>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
