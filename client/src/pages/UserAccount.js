import React, { useState, useEffect } from "react";
import UserModal from "../components/UserModal.js";
import "../styles/UserAccount.css";

const getCurrentUserId = async () => {
  const userId = sessionStorage.getItem("userId");
  return parseInt(userId, 10);
};

function UserAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const fetchUserIdAndData = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error("User ID is not available");
      }

      const userResponse = await fetch(
        `http://localhost:5000/api/users/${userId}`
      );
      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }
      const userData = await userResponse.json();

      if (userData.data && userData.data.length > 0) {
        setUser(userData.data[0]);
      } else {
        setError("User does not exist");
      }
    } catch (error) {
      setError(`Error fetching user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIdAndData();
  }, []);

  const handleEdit = () => {
    setModalTitle(user ? user.username : "");
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const userId = await getCurrentUserId();
        const response = await fetch(`http://localhost:5000/api/users/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        sessionStorage.removeItem("userId");
        window.location.href = "/login";
      } catch (error) {
        setError(`Error deleting user: ${error.message}`);
      }
    }
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const userId = await getCurrentUserId();
      const response = await fetch(`http://localhost:5000/api/users/update`, {
        method: "POST",
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
      await fetchUserIdAndData();
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
      <h1>User Account</h1>
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
      />
    </div>
  );
}

export default UserAccount;
