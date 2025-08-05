import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext.js";
import { useNavigate } from "react-router-dom";
import UserModal from "../components/UserModal.js";
import "../styles/AllUsers.css";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getUserData, logout } = useAuth();
  const { userId: currentUserId, userRole: currentUserRole } = getUserData();
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
        alert(`Failed to fetch users: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch("http://localhost:5000/api/users/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
            currentUserId,
            currentUserRole,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        setUsers(users.filter((user) => user.id !== userId));
        if (parseInt(userId) === parseInt(currentUserId)) {
          logout();
          navigate("/login");
        }
      } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        alert(`Failed to delete user: ${error.message}`);
      }
    }
  };

 const handleSaveUser = async (updatedUser) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT", // Changed from POST to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedUser.id,
          name: updatedUser.name,
          lastname: updatedUser.lastname,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          password: updatedUser.newPassword && updatedUser.newPassword.trim() ? updatedUser.newPassword : undefined,
          currentUserId,
          currentUserRole,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      alert(`Failed to update user: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>All Users</h1>
      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.lastname}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      {selectedUser && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          initialUser={selectedUser}
        />
      )}
    </div>
  );
}

export default AllUsers;