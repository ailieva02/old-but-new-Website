import React from "react";
import "../styles/PostCard.css";

function PostCard({ title, body, image }) {
  return (
    <div className="post-card">
      <img
        src={`./src/assets/images/${image}`}
        alt={title}
        className="post-image"
      />
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

export default PostCard;
