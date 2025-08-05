import React, { useState, useEffect } from "react";
import StarRating from "../components/StarRating.js";
import "../styles/PostInfo.css";

function PostInfo({ post, onEdit, onDelete, getImage }) {
  const [username, setUsername] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [averageRating, setAverageRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userRating, setUserRating] = useState(null);

  const imageUrl = post.image ? getImage(post.image) : null;
  const userId = sessionStorage.getItem("userId");

  const fetchAdditionalData = async () => {
    try {
      const [userResponse, categoryResponse, ratingsResponse] =
        await Promise.all([
          fetch(`http://localhost:5000/api/users/${post.user_id}`),
          fetch(`http://localhost:5000/api/categories/${post.category_id}`),
          fetch(
            `http://localhost:5000/api/ratings-by-post-id?post_id=${post.id}`
          ),
        ]);

      if (!userResponse.ok || !categoryResponse.ok || !ratingsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [userData, categoryData, ratingsData] = await Promise.all([
        userResponse.json(),
        categoryResponse.json(),
        ratingsResponse.json(),
      ]);

      setUsername(
        userData.success && Array.isArray(userData.data)
          ? userData.data[0].username
          : "Unknown user"
      );

      setCategoryName(
        categoryData.success && Array.isArray(categoryData.data)
          ? categoryData.data[0].title
          : "Unknown category"
      );

      if (ratingsData.success) {
        const ratingsWithUsernames = await Promise.all(
          ratingsData.data.map(async (rating) => {
            const userResponse = await fetch(
              `http://localhost:5000/api/users/${rating.user_id}`
            );
            const userData = await userResponse.json();
            return {
              ...rating,
              username:
                userData.success && Array.isArray(userData.data)
                  ? userData.data[0].username
                  : "Unknown user",
            };
          })
        );

        setRatings(ratingsWithUsernames);
        calculateAverageRating(ratingsWithUsernames);

        const foundRating = ratingsWithUsernames.find(
          (rating) => rating.user_id === parseInt(userId)
        );
        setUserRating(foundRating ? foundRating.stars : null);
      } else {
        setRatings([]);
        setAverageRating("No ratings yet");
      }
    } catch (error) {
      setError(`Failed to fetch additional data: ${error.message}`);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      setAverageRating("No ratings yet");
      return;
    }
    const total = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    setAverageRating((total / ratings.length).toFixed(1));
  };

  const handleRatingSubmit = async (stars) => {
    try {
      const userId = parseInt(sessionStorage.getItem("userId"));
      const endpoint = userRating !== null ? "update" : "create";
      const method = endpoint === "update" ? "PUT" : "POST";
      const body = JSON.stringify({
        post_id: post.id,
        user_id: userId,
        stars,
      });

      const response = await fetch(
        `http://localhost:5000/api/ratings/${endpoint}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      fetchAdditionalData();  // Refresh ratings and average
      setSuccessMessage("Rating submitted successfully!");
    } catch (error) {
      setError(`Failed to submit rating: ${error.message}`);
    }
  };

  const deleteRating = async (ratingId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ratings/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating_id: ratingId }), // Sending ratingId in the request body
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete rating");
      }
  
      // Remove the deleted rating from the list and update the state
      const updatedRatings = ratings.filter((rating) => rating.id !== ratingId);
      setRatings(updatedRatings);
  
      // Recalculate average after deleting
      calculateAverageRating(updatedRatings); // Pass the updated ratings directly
  
      setSuccessMessage("Rating deleted successfully!");
    } catch (error) {
      setError(`Failed to delete rating: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAdditionalData();
  }, [post.id, post.user_id, post.category_id]);

  return (
    <div className="post-info">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-category">Category: {categoryName}</p>
      {imageUrl && (
        <img src={imageUrl} alt={post.title} className="post-image" />
      )}
      <button className="edit-button" onClick={onEdit}>
        Edit
      </button>
      <button className="delete-button" onClick={onDelete}>
        Delete
      </button>
      <p className="post-body">{post.body}</p>
      <p className="post-author">Posted by: {username}</p>
      <p className="post-rating">Average Rating: {averageRating}</p>
      <div className="post-actions"></div>
      {error && <p className="error-message">Error: {error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="ratings-section">
        <h2>Ratings:</h2>
        {ratings.length > 0 ? (
          <ul className="ratings-list">
            {ratings.map((rating) => (
              <li key={rating.id} className="rating-item">
                Rating: {rating.stars} by {rating.username}
                <button
                  className="delete-rating-button"
                  onClick={() => deleteRating(rating.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ratings yet</p>
        )}
      </div>

      <div className="rating-form">
        <h2>Rate this post:</h2>
        <StarRating
          postId={post.id}
          onRatingSubmit={handleRatingSubmit}
          userRating={userRating}
        />
      </div>
    </div>
  );
}

export default PostInfo;
