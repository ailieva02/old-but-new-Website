import React from "react";
import PostCard from "../components/PostCard";
import "../styles/Home.css";
import img1 from "../assets/images/img1.png";
import img2 from "../assets/images/img2.png";
import img3 from "../assets/images/img3.png";
import img4 from "../assets/images/img4.png";
import img5 from "../assets/images/img5.png";
import img6 from "../assets/images/img6.png";
import img7 from "../assets/images/img7.png";
import img8 from "../assets/images/img8.png";
import img9 from "../assets/images/img9.png";
import img10 from "../assets/images/img10.png";
import img11 from "../assets/images/img11.png";
import img12 from "../assets/images/img12.png";

function Home() {
  const posts = [
    {
      id: 1,
      title: "Tech Post 1",
      body: "This is a tech post body by John Doe.",
      image: img1,
      category: "Tech",
    },
    {
      id: 2,
      title: "Science Post 1",
      body: "This is a science post body by John Doe.",
      image: img2,
      category: "Science",
    },
    {
      id: 3,
      title: "Travel Post 1",
      body: "This is a travel post body by Jane Smith.",
      image: img3,
      category: "Travel",
    },
    {
      id: 4,
      title: "Food Post 1",
      body: "This is a food post body by Jane Smith.",
      image: img4,
      category: "Food",
    },
    {
      id: 5,
      title: "Tech Post 2",
      body: "This is another tech post body by John Doe.",
      image: img5,
      category: "Tech",
    },
    {
      id: 6,
      title: "Science Post 2",
      body: "This is another science post body by John Doe.",
      image: img6,
      category: "Science",
    },
    {
      id: 7,
      title: "Travel Post 2",
      body: "This is another travel post body by Jane Smith.",
      image: img7,
      category: "Travel",
    },
    {
      id: 8,
      title: "Food Post 2",
      body: "This is another food post body by Jane Smith.",
      image: img8,
      category: "Food",
    },
    {
      id: 9,
      title: "Tech Post 3",
      body: "This is yet another tech post body by John Doe.",
      image: img9,
      category: "Tech",
    },
    {
      id: 10,
      title: "Science Post 3",
      body: "This is yet another science post body by John Doe.",
      image: img10,
      category: "Science",
    },
    {
      id: 11,
      title: "Travel Post 3",
      body: "This is yet another travel post body by Jane Smith.",
      image: img11,
      category: "Travel",
    },
    {
      id: 12,
      title: "Food Post 3",
      body: "This is yet another food post body by Jane Smith.",
      image: img12,
      category: "Food",
    },
    {
      id: 13,
      title: "Tech Post 4",
      body: "This is a tech post body by John Doe.",
      image: img1,
      category: "Tech",
    },
    {
      id: 14,
      title: "Science Post 4",
      body: "This is a science post body by John Doe.",
      image: img2,
      category: "Science",
    },
    {
      id: 15,
      title: "Travel Post 4",
      body: "This is a travel post body by Jane Smith.",
      image: img3,
      category: "Travel",
    },
    {
      id: 16,
      title: "Food Post 4",
      body: "This is a food post body by Jane Smith.",
      image: img4,
      category: "Food",
    },
    {
      id: 17,
      title: "Tech Post 5",
      body: "This is another tech post body by John Doe.",
      image: img5,
      category: "Tech",
    },
    {
      id: 18,
      title: "Science Post 5",
      body: "This is another science post body by John Doe.",
      image: img6,
      category: "Science",
    },
    {
      id: 19,
      title: "Travel Post 5",
      body: "This is another travel post body by Jane Smith.",
      image: img7,
      category: "Travel",
    },
    {
      id: 20,
      title: "Food Post 5",
      body: "This is another food post body by Jane Smith.",
      image: img8,
      category: "Food",
    },
    {
      id: 21,
      title: "Tech Post 6",
      body: "This is yet another tech post body by John Doe.",
      image: img9,
      category: "Tech",
    },
    {
      id: 22,
      title: "Science Post 6",
      body: "This is yet another science post body by John Doe.",
      image: img10,
      category: "Science",
    },
    {
      id: 23,
      title: "Travel Post 6",
      body: "This is yet another travel post body by Jane Smith.",
      image: img11,
      category: "Travel",
    },
    {
      id: 24,
      title: "Food Post 6",
      body: "This is yet another food post body by Jane Smith.",
      image: img12,
      category: "Food",
    },
    {
      id: 25,
      title: "Tech Post 7",
      body: "This is a tech post body by John Doe.",
      image: img1,
      category: "Tech",
    },
    {
      id: 26,
      title: "Science Post 7",
      body: "This is a science post body by John Doe.",
      image: img2,
      category: "Science",
    },
    {
      id: 27,
      title: "Travel Post 7",
      body: "This is a travel post body by Jane Smith.",
      image: img3,
      category: "Travel",
    },
    {
      id: 28,
      title: "Food Post 7",
      body: "This is a food post body by Jane Smith.",
      image: img4,
      category: "Food",
    },
  ];

  const categories = [...new Set(posts.map((post) => post.category))];

  return (
    <div className="home-container">
      {categories.map((category) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="post-container">
            {posts
              .filter((post) => post.category === category)
              .map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  body={post.body}
                  image={post.image}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
