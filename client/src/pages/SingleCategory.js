import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import CategoryModal from "../components/CategoryModal";
import "../styles/SingleCategory.css";

function SingleCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const filteredPosts = result.data.filter(
          (post) => post.category_id === parseInt(id)
        );
        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts || []);
        console.log("Posts fetched successfully:", sortedPosts);
      } catch (error) {
        setError(`Error fetching posts: ${error.message}`);
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.data || []);
        console.log("Users fetched successfully:", result.data);
      } catch (error) {
        setError(`Error fetching users: ${error.message}`);
        console.error(error);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/categories/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setCategory(result.data || null);
        console.log("Category fetched successfully:", result.data);
      } catch (error) {
        setError(`Error fetching category: ${error.message}`);
        console.error(error);
      }
    };

    // Fetch data when the component mounts
    const fetchData = async () => {
      await fetchAllPosts();
      await fetchUsers();
      await fetchCategory();
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const findUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleDeleteCategory = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/categories/delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: parseInt(id) }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        navigate("/categories");
      } catch (error) {
        setError(`Error deleting category: ${error.message}`);
        console.error(error);
      }
    }
  };

  const handleOpenModal = () => {
    setModalTitle(category ? category.title : "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCategory = async (updatedCategory) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: parseInt(id),
            title: updatedCategory.title,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.reload();
    } catch (error) {
      setError(`Error updating category: ${error.message}`);
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="single-category-container">
      <h1>Posts in Category {category ? category[0].title : "Loading..."}</h1>
      <div className="category-actions">
        <button className="update-category-button" onClick={handleOpenModal}>
          Edit
        </button>
        <button
          className="delete-category-button"
          onClick={handleDeleteCategory}
        >
          Delete
        </button>
      </div>
      <div className="post-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              body={post.body}
              image={`http://localhost:5000/images/${post.image}`}
              rating={post.rating}
              user={findUserNameById(post.user_id)}
              created_at={post.created_at}
              onClick={() => handlePostClick(post.id)}
            />
          ))
        ) : (
          <p>No posts found for this category.</p>
        )}
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        initialTitle={modalTitle}
      />
    </div>
  );
}

export default SingleCategory;
