import React, { useState } from "react";
import "../styles/Login.css";

const handleLogin = async (userEmail, userPassword) => {
  const response = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail, password: userPassword }),
  });

  const result = await response.json();
  if (result && result.success && result.data) {
    sessionStorage.setItem("userId", result.data);
    console.log("session storage", sessionStorage.getItem("userId"));
  } else {
    console.log("something went wrong!");
    if (result) {
      console.log(result);
    }
  }
};

const handleLogout = async () => {
  // await fetch('/api/logout', { method: 'POST' });
  sessionStorage.removeItem("userId");
  console.log("session storage", sessionStorage.getItem("userId"));
};

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return "All fields are required.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await handleLogin(formData.email, formData.password);
      // Handle redirection or state update here
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
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
            className="form-input"
            required
          />
        </label>
        <br />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
