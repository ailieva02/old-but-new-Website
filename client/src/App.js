import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import UserAccount from "./pages/UserAccount.js";
import SinglePost from "./pages/SinglePost.js";
import AddEditPost from "./pages/AddEditPost.js";
import Categories from "./pages/Categories";
import AllUsers from "./pages/AllUsers";
import SingleCategory from "./pages/SingleCategory.js";
import NavBar from "./components/NavBar.js";

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: 20 }}>
        <NavBar /> {}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-account" element={<UserAccount />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/add-edit-post" element={<AddEditPost />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/category/:id" element={<SingleCategory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
