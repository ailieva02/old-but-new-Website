import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import "../styles/Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const categoryRefs = useRef({});
  const navigate = useNavigate();

  // Fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setPosts(result.data || []);
    } catch (error) {
      setError(`Error fetching posts: ${error.message}`);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setUsers(result.data || []);
    } catch (error) {
      setError(`Error fetching users: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchUsers();
  }, []);

  // Handle vertical scroll to horizontal scroll in category sections
  const handleScroll = (e, category) => {
    const container = categoryRefs.current[category];
    if (container) {
      container.scrollLeft += e.deltaY;
    }
  };

  // Organize posts by category
  const postsByCategory = categories.reduce((acc, category) => {
    const filteredPosts = posts
      .filter((post) => post.category_id === category.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort posts by date, latest first
    if (filteredPosts.length > 0) {
      acc[category.title] = filteredPosts;
    }
    return acc;
  }, {});

  // Find user by ID
  const findUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
  };

  return (
    <div className="home-container">
      {error && <p className="error-message">{error}</p>}

      <button
        className="add-post-button"
        onClick={() => navigate("/add-edit-post")}
      >
        Add Post
      </button>

      {Object.entries(postsByCategory).map(([category, posts]) => (
        <div
          key={category}
          className="category-section"
          onWheel={(e) => handleScroll(e, category)}
          ref={(el) => (categoryRefs.current[category] = el)}
        >
          <h2 className="category-title">{category}</h2>
          <div className="post-container">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                body={post.body}
                image={post.image}
                rating={post.rating}
                user={findUserNameById(post.user_id)}
                created_at={post.created_at}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
