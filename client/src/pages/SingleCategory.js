import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import CategoryModal from "../components/CategoryModal";
import { useAuth } from "../components/AuthContext.js";
import "../styles/SingleCategory.css";

function SingleCategory() {
  const { id } = useParams(); // category id
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const { isAdmin, getUserData } = useAuth();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {

     const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert(`Failed to fetch users: ${error.message}`);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/posts`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const filteredPosts = result.data.filter(
          (post) => post.categoryId === parseInt(id)
        );
        console.log("postovite: ", filteredPosts);
        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts || []);
        console.log("Posts fetched successfully:", sortedPosts);
      } catch (error) {
        setError(`Error fetching posts: ${error.message}`);
        console.error(error);
      }
    };



    const fetchCategory = async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API}/api/categories/${id}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            setCategory(result.data || null);
            console.log("Category fetched successfully:", result.data);
            return result.data;
          } catch (error) {
            setError(`Error fetching category: ${error.message}`);
            console.error(error);
          }
        };



     const fetchUsername = async (categoryData) => {
      try {
        const {userId: currentUserId, userRole}  = getUserData();

        if (currentUserId && currentUserId !== "Unknown") {
          // If userId matches current user, use stored username
          if (parseInt(categoryData[0].userId) === parseInt(currentUserId)) {
            setCanEditOrDelete(isAdmin || parseInt(categoryData[0].userId) === parseInt(currentUserId, 10));
            return;
          }
          const categoryUserId = categoryData[0].userId;
          const response = await fetch(
            `${process.env.REACT_APP_API}/api/users/${categoryUserId}?currentUserId=${currentUserId}&currentUserRole=${userRole}`
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


       // Fetch data when the component mounts
    const fetchData = async () => {
      await fetchAllPosts();
      const categoryData = await fetchCategory();
      await fetchUsername(categoryData);
      await fetchUsers();
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
      const { userId: currentUserId, userRole } = getUserData();
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/categories/delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: parseInt(id),
               currentUserId: currentUserId,
               currentUserRole: userRole,
             }),
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
    setModalTitle(category ? category[0].title : "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCategory = async (updatedCategory) => {
  try {
    const { userId: currentUserId, userRole } = getUserData();
    if (!currentUserId || !userRole) {
      throw new Error("Current user ID or role is missing");
    }

    const response = await fetch(
      `${process.env.REACT_APP_API}/api/categories/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(id),
          title: updatedCategory.title,
          userId: updatedCategory.userId,
          currentUserId: parseInt(currentUserId),
          currentUserRole: userRole
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    navigate("/categories");
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
        {canEditOrDelete && (
          <>
            <button className="update-category-button" onClick={handleOpenModal}>
              Edit
            </button>
            <button
              className="delete-category-button"
              onClick={handleDeleteCategory}
            >
              Delete
            </button>
         </>
        )}
      </div>
      <div className="post-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              body={post.body}
              image={post.image}
              rating={post.rating}
              user={findUserNameById(post.userId)}
              createdAt={post.createdAt}
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
