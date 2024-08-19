import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import UserAccount from "./pages/UserAccount.js";
import SinglePost from "./pages/SinglePost.js";
import EditPost from "./pages/EditPost.js"; // New component for editing posts
import Categories from "./pages/Categories";
import AllUsers from "./pages/AllUsers";
import SingleCategory from "./pages/SingleCategory.js";
import NavBar from "./components/NavBar.js";
import { AuthProvider } from "./components/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import AddEditPost from "./pages/AddEditPost.js";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App" style={{ padding: 20 }}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/user-account"
              element={<ProtectedRoute element={<UserAccount />} />}
            />
            <Route
              path="/post/:id"
              element={<ProtectedRoute element={<SinglePost />} />}
            />
            <Route
              path="/add-edit-post"
              element={<ProtectedRoute element={<AddEditPost />} />}
            />
            <Route
              path="/edit-post/:id"
              element={<ProtectedRoute element={<EditPost />} />} // New route for editing posts
            />
            <Route
              path="/categories"
              element={<ProtectedRoute element={<Categories />} />}
            />
            <Route
              path="/all-users"
              element={<ProtectedRoute element={<AllUsers />} />}
            />
            <Route
              path="/category/:id"
              element={<ProtectedRoute element={<SingleCategory />} />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
