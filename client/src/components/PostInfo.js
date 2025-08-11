import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating.js";
import { useAuth } from "../components/AuthContext";
import "../styles/PostInfo.css";

function PostInfo({ post, onEdit, onDelete, getImage, averageRating }) {
  const navigate = useNavigate();
  const id = post.id;
  const [username, setUsername] = useState("");
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userRating, setUserRating] = useState(null);
  const { getUserData } = useAuth();
  const [averageFromInfoRating, setAverageFromInfoRating] = useState(0);
  const [users, setUsers] = useState([]);

  const imageUrl = post.image ? getImage(post.image) : null;

  const { userId: currentUserId, userRole: currentUserRole } = getUserData();

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/users?currentUserId=${currentUserId}&currentUserRole=${currentUserRole}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const user = result.data.find((u) => u.id === post.userId);
        if (user) {
          setUsername(user.username || "Unknown user");
        } else {
          console.error(`User with ID ${post.userId} not found`);
          setUsername("Unknown user");
        }
        setUsers(result.data); // Store all users if needed elsewhere
      } else {
        console.error("Unexpected users data format:", result);
        setUsername("Unknown user");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(`Failed to fetch users: ${error.message}`);
      setUsername("Unknown user");
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/categories/${post.categoryId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setCategoryName(result.data[0].title || "Unknown category");
      } else {
        console.error("Unexpected category data format:", result);
        setCategoryName("Unknown category");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setError(`Failed to fetch category: ${error.message}`);
      setCategoryName("Unknown category");
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ratings-by-post-id?postId=${post.id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const ratingsWithUsernames = await Promise.all(
          result.data.map(async (rating) => {
            const userResponse = await fetch(
              `${process.env.REACT_APP_API}/api/users/${rating.userId}?currentUserId=${currentUserId}&currentUserRole=${currentUserRole}`
            );
            const userData = await userResponse.json();
            return {
              ...rating,
              username:
                userData.success && userData.data
                  ? userData.data.username || "Unknown user"
                  : "Unknown user",
            };
          })
        );
        setRatings(ratingsWithUsernames);
        calculateAverageRating(ratingsWithUsernames);
        const foundRating = ratingsWithUsernames.find(
          (rating) => rating.userId === parseInt(currentUserId)
        );
        setUserRating(foundRating ? foundRating.stars : null);
      } else {
        console.error("Unexpected ratings data format:", result);
        setRatings([]);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setError(`Failed to fetch ratings: ${error.message}`);
      setRatings([]);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ratings-average-by-post-id?postId=${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAverageFromInfoRating(data.data.average_stars || 0);
    } catch (error) {
      console.error(`Error fetching average rating: ${error.message}`);
      setError(`Failed to fetch average rating: ${error.message}`);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      setAverageFromInfoRating(0);
      return;
    }
    const total = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    setAverageFromInfoRating(total / ratings.length);
  };

  const handleRatingSubmit = async (stars) => {
    try {
      const body = JSON.stringify({
        postId: post.id,
        userId: parseInt(currentUserId),
        stars,
        currentUserId: parseInt(currentUserId),
      });

      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ratings/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchAverageRating();
      fetchRatings();
      navigate(`/post/${post.id}`);
    } catch (error) {
      setError(`Failed to submit rating: ${error.message}`);
      console.error("Error submitting rating:", error);
    }
  };

  useEffect(() => {

      setCanEditOrDelete(
      parseInt(currentUserId) === post.userId || currentUserRole === "admin"
    );

    fetchUsers();
    fetchCategory();
    fetchRatings();
    fetchAverageRating();
  }, [post.id, post.userId, post.categoryId]);

  return (
    <div className="post-info">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-category">Category: {categoryName}</p>
      {imageUrl && (
        <img src={imageUrl} alt={post.title} className="post-image" />
      )}
       {canEditOrDelete && (
        <>
          <button className="edit-button" onClick={onEdit}>
            Edit
          </button>
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
        </>
      )}
      <p className="post-body">{post.body}</p>
      <p className="post-author">Posted by: {username}</p>
      <p className="post-rating">Average Rating: {averageFromInfoRating}</p>
      <div className="post-actions"></div>

      <div className="rating-form">
        <h2>Rate this post:</h2>
        <StarRating
          postId={post.id}
          onRatingSubmit={handleRatingSubmit}
          userRating={userRating}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default PostInfo;