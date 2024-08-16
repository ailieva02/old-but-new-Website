import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostCard.css";

function PostCard({ id, title, body, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="post-card" onClick={handleClick}>
      <img src={image} alt={title} className="post-image" />
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

export default PostCard;
