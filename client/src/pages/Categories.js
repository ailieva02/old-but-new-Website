import React, { useState, useEffect } from "react";
import "../styles/Categories.css";
import CategoryCard from "../components/CategoryCard";
import CategoryModal from "../components/CategoryModal";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      setError(`Error fetching categories: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEnter = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
    } catch (error) {
      console.error(`Error fetching category details: ${error.message}`);
    }
  };

  const handleEdit = (id) => {
    setSelectedCategory(id);
    setModalType("edit");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/categories/delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchCategories(); // Refresh the category list
      } catch (error) {
        console.error(`Error deleting category: ${error.message}`);
      }
    }
  };

  const handleSave = async (category) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${
          modalType === "edit" ? "update" : "create"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: category.title,
            ...(modalType === "edit" && { id: selectedCategory }),
            created_at:
              modalType === "create" ? new Date().toISOString() : undefined,
            user_id: sessionStorage.getItem("userId"),
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error(`Error saving category: ${error.message}`);
    }
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setModalType(null);
  };

  return (
    <div className="categories-container">
      <h1>Categories Page</h1>
      <button
        className="add-category-button"
        onClick={() => {
          setModalType("create");
          setSelectedCategory(null);
        }}
      >
        Add Category
      </button>
      <div className="categories-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              title={category.title}
              createdAt={category.created_at}
              userId={category.user_id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEnter={handleEnter}
            />
          ))
        ) : (
          <p className="no-categories">No categories available</p>
        )}
      </div>
      <CategoryModal
        isOpen={modalType !== null}
        onClose={handleModalClose}
        onSave={handleSave}
        initialTitle={
          selectedCategory
            ? categories.find((cat) => cat.id === selectedCategory)?.title
            : ""
        }
        type={modalType}
      />
    </div>
  );
}

export default Categories;
