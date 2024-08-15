import React from "react";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form className="login-form">
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
