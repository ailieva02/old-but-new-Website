import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext.js";
import "../styles/CategoryCard.css";
import { useNavigate } from "react-router-dom";

function CategoryCard({
  id,
  title = "Untitled",
  createdAt = "Unknown",
  username = "Unknown",
  userId = null,
  onEdit,
  onDelete,
  onEnter,
}) {

  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const { isAdmin, getUserData } = useAuth();
  const { userId: currentUserId, userRole, username: currentUsername } = getUserData();
  const navigate = useNavigate();


  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (userId && userId !== "Unknown") {
          // If userId matches current user, use stored username
          if (parseInt(userId, 10) === parseInt(currentUserId, 10) && currentUsername) {
            setCanEditOrDelete(isAdmin || parseInt(userId, 10) === parseInt(currentUserId, 10));
            return;
          }

          const response = await fetch(
            `http://localhost:5000/api/users/${userId}?currentUserId=${currentUserId}&currentUserRole=${userRole}`
          );
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `HTTP error! Status: ${response.status}`
            );
          }
          const result = await response.json();
          const fetchedUserId = parseInt(result.data[0]?.id, 10);

          if (Array.isArray(result.data) && result.data.length > 0) {
            setCanEditOrDelete(isAdmin || parseInt(currentUserId, 10) === fetchedUserId);
          } 
        }
      } catch (error) {
        console.error("Error fetching username:", error.message, error);
      }
    };

    fetchUsername();
  }, [userId, isAdmin, currentUserId, currentUsername, userRole]);

  const handleEnter = () => {
    navigate(`/category/${id}`);
  };

  return (
    <div className="category-card">
      <h2>{title}</h2>
      <p>Created At: {createdAt}</p>
      <p>User: {username}</p>
      <div className="card-buttons">
        <button className="card-button enter" onClick={handleEnter}>
          Enter
        </button>
        {canEditOrDelete && (
          <>
            <button className="card-button edit" onClick={() => onEdit(id)}>
              Edit
            </button>
            <button className="card-button delete" onClick={() => onDelete(id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;
