import React, { useState, useEffect } from "react";

const getCurrentUserId = async () => {
  return 3; // Hardcoded as a placeholder
};

function UserAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchUserIdAndData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>User Account</h1>
      {user ? (
        <div>
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
            Role: <b>{user.role}</b>
          </p>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}

export default UserAccount;
