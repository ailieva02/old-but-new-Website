import React, { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
        }),
      });

      if (response.ok) {
        setSuccess("Registration successful!");
        setFormData({
          name: "",
          lastname: "",
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          role: "",
        });
      } else {
        const result = await response.json();
        setError(result.message || "Failed to register.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="button" onClick={handleSubmit}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
