import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserModal from "../components/UserModal"; // Assuming UserModal is used for editing
import "../styles/UserAccount.css";

const SpecificUserDetail = () => {
  const { userId } = useParams(); // Get the userId from the URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch(
        `${process.env.REACT_APP_API}/api/users/${userId}`
      );
      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }
      const userData = await userResponse.json();
      setUser(userData.data[0]);
    } catch (error) {
      setError(`Error fetching user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    setModalTitle(user ? user.username : "");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/users/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Redirect after deletion or handle accordingly
        window.location.href = "/users"; // Redirect to a list of users or some other page
      } catch (error) {
        setError(`Error deleting user: ${error.message}`);
      }
    }
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          name: updatedUser.name,
          lastname: updatedUser.lastname,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Refetch user data after updating
      await fetchUserData();
      setIsModalOpen(false);
    } catch (error) {
      setError(`Error updating user: ${error.message}`);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="user-account-container">
      <h1>User Details</h1>
      {user ? (
        <div className="user-info">
          <p>
            Name: <b>{user.name}</b>
          </p>
          <p>
            Last Name: <b>{user.lastname}</b>
          </p>
          <p>
            Username: <b>{user.username}</b>
          </p>
          <p>
            Email: <b>{user.email}</b>
          </p>
          <p>
            Role: <b>{user.role}</b>
          </p>
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      ) : (
        <p>No user found</p>
      )}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialUser={user}
        title={modalTitle}
      />
    </div>
  );
};

export default SpecificUserDetail;
