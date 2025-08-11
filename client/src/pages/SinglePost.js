import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostInfo from "../components/PostInfo";
import CommentsSection from "../components/CommentsSection";
import "../styles/SinglePost.css";
import { useAuth } from "../components/AuthContext";

const getImage = (imageName) => {
  try {
    return require(`../assets/images/${imageName}`);
  } catch (err) {
    console.error(`Image not found: ${imageName}`);
    return require(`../assets/images/default.png`);
  }
};

function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const { getUserData } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const { userId: currentUserId, userRole: currentUserRole } = getUserData();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the post data");
        }
        const data = await response.json();
        setPost(data.data[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/ratings-average-by-post-id?postId=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the average rating");
        }
        const data = await response.json();
        setAverageRating(data.data.average_stars || 0);
      } catch (error) {
        console.error(`Error fetching average rating: ${error.message}`);
      }
    };

    fetchPost();
    fetchAverageRating();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/posts/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id,
        currentUserId: currentUserId,
      currentUserRole: currentUserRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }

      navigate("/");
    } catch (error) {
      console.error(`Error deleting post: ${error.message}`);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
  <div className="single-post">
      <PostInfo
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getImage={getImage}
      />
      <CommentsSection postId={id} postUserId={post.userId} />
    </div>
  );
}

export default SinglePost;
