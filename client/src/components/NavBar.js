import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <ul>
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
