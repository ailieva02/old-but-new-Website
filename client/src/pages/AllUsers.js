import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AllUsers.css"; // Importing the CSS file
import UserModal from "../components/UserModal.js"; // Import the UserModal

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // To store the selected user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost:5000/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user); // Set the selected user data
    setIsModalOpen(true); // Open the modal
  };

  const handleOpen = (id) => {
    navigate(`/users/${id}`);
  };

  const handleSave = async (updatedUser) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      alert("User updated successfully.");
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="all-users-container">
      <h1 className="all-users-title">All Users</h1>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.name} {user.lastname}
                </td>
                <td>{user.username}</td>
                <td>
                  <button className="btn open-btn" onClick={() => handleOpen(user.id)}>
                    Open
                  </button>
                  <button className="btn edit-btn" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="btn delete-btn" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-users-message">No users found.</p>
      )}

      {/* Render UserModal when isModalOpen is true */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal
          onSave={handleSave} // Pass the save function to modal
          initialUser={selectedUser} // Pass the selected user data
        />
      )}
    </div>
  );
}

export default AllUsers;
