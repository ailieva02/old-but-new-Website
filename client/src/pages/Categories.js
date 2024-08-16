import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Technology", description: "Posts related to technology." },
    { id: 2, name: "Science", description: "Posts related to science." },
    { id: 3, name: "Travel", description: "Posts related to travel." },
    { id: 4, name: "Food", description: "Posts related to food." },
    { id: 5, name: "Lifestyle", description: "Posts related to lifestyle." },
    {
      id: 6,
      name: "Entertainment",
      description: "Posts related to entertainment.",
    },
    { id: 7, name: "Health", description: "Posts related to health." },
    { id: 8, name: "Sports", description: "Posts related to sports." },
    { id: 9, name: "Education", description: "Posts related to education." },
    { id: 10, name: "Finance", description: "Posts related to finance." },
    { id: 11, name: "Business", description: "Posts related to business." },
    { id: 12, name: "Art", description: "Posts related to art." },
  ];

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
  };

  return (
    <div className="categories-container">
      <h1>Categories Page</h1>
      <p>This is where categories will be shown.</p>
      <div className="categories-list">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
