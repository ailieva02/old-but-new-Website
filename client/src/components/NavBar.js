import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import { useAuth } from "./AuthContext";

function NavBar() {
  const [username, setUsername] = useState("Loading...");
  const { isAuthenticated, logout, getUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { userId, userRole } = getUserData();
        if (userId && userRole) {
          const response = await fetch(
            `http://localhost:5000/api/users/${userId}?currentUserId=${userId}&currentUserRole=${userRole}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const userData = await response.json();

          if (userData.data && userData.data.length > 0) {
            setUsername(userData.data[0].username);
          } else {
            setUsername("User not found");
          }
        } else {
          setUsername("Loading...");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUsername("Error fetching user");
      }
    };

    if (isAuthenticated) {
      fetchUsername();
    } else {
      setUsername("Loading...");
    }
  }, [isAuthenticated, getUserData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjl1MHcxM25jZXl3aWhkcnhyaWJoNHBnZzl0OXFqMnZia2hwZXY0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l49JZ1oF2qHawdmzm/giphy.webp"
          alt="Logo"
          className="logo"
        />
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/user-account">User Account</Link>
            </li>
            <li>
              <Link to="/add-edit-post">Add/Edit Post</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/all-users">All Users</Link>
            </li>
            <li>
              <span className="user-name">{username}</span>
            </li>
            <li>
              <Link to="/login" onClick={handleLogout} className="nav-link">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;