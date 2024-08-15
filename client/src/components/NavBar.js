import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <img
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjl1MHcxM25jZXl3aWhkcnhyaWJoNHBnZzl0OXFqMnZia2hwZXY0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l49JZ1oF2qHawdmzm/giphy.webp"
        alt="Logo"
        className="logo"
      />
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
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
      </ul>
    </nav>
  );
}

export default NavBar;
