import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext.js";
import "../styles/CategoryCard.css";
import { useNavigate } from "react-router-dom";

function CategoryCard({
  id,
  title = "Untitled",
  createdAt = "Unknown",
  userId = null,
  onEdit,
  onDelete,
  onEnter,
}) {
  const [username, setUsername] = useState("Loading...");
  const { isAdmin } = useAuth();
  const sessionUserId = parseInt(sessionStorage.getItem("userId"), 10);
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (userId && userId !== "Unknown") {
          const response = await fetch(
            `http://localhost:5000/api/users/${userId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          const fetchedUserId = parseInt(result.data[0]?.id, 10);

          if (Array.isArray(result.data) && result.data.length > 0) {
            setUsername(result.data[0]?.username || "Unknown User");

            if (isAdmin || sessionUserId === fetchedUserId) {
              setCanEditOrDelete(true);
            }
          } else {
            setUsername("Unknown User");
          }
        } else {
          setUsername("Unknown User");
        }
      } catch (error) {
        console.error(`Error fetching username: ${error.message}`);
        setUsername("Unknown User");
      }
    };

    fetchUsername();
  }, [userId, isAdmin, sessionUserId]);

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
