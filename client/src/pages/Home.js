import React from "react";
import PostCard from "../components/PostCard";
import "../styles/Home.css";
import screenshot6 from "../assets/images/Screenshot_6.png";

function Home() {
  const posts = [
    {
      id: 1,
      title: "Tech Post 1",
      body: "This is a tech post body by John Doe.",
      image: screenshot6,
    },
    {
      id: 2,
      title: "Science Post 1",
      body: "This is a science post body by John Doe.",
      image: "science1.jpg",
    },
    {
      id: 3,
      title: "Travel Post 1",
      body: "This is a travel post body by Jane Smith.",
      image: "travel1.jpg",
    },
    {
      id: 4,
      title: "Food Post 1",
      body: "This is a food post body by Jane Smith.",
      image: "food1.jpg",
    },
    {
      id: 5,
      title: "Tech Post 2",
      body: "This is another tech post body by John Doe.",
      image: "tech2.jpg",
    },
    {
      id: 6,
      title: "Science Post 2",
      body: "This is another science post body by John Doe.",
      image: "science2.jpg",
    },
    {
      id: 7,
      title: "Travel Post 2",
      body: "This is another travel post body by Jane Smith.",
      image: "travel2.jpg",
    },
    {
      id: 8,
      title: "Food Post 2",
      body: "This is another food post body by Jane Smith.",
      image: "food2.jpg",
    },
    {
      id: 9,
      title: "Tech Post 3",
      body: "This is yet another tech post body by John Doe.",
      image: "tech3.jpg",
    },
    {
      id: 10,
      title: "Science Post 3",
      body: "This is yet another science post body by John Doe.",
      image: "science3.jpg",
    },
    {
      id: 11,
      title: "Travel Post 3",
      body: "This is yet another travel post body by Jane Smith.",
      image: "travel3.jpg",
    },
    {
      id: 12,
      title: "Food Post 3",
      body: "This is yet another food post body by Jane Smith.",
      image: "food3.jpg",
    },
    {
      id: 13,
      title: "Tech Post 4",
      body: "This is a tech post body by John Doe.",
      image: "tech4.jpg",
    },
    {
      id: 14,
      title: "Science Post 4",
      body: "This is a science post body by John Doe.",
      image: "science4.jpg",
    },
    {
      id: 15,
      title: "Travel Post 4",
      body: "This is a travel post body by Jane Smith.",
      image: "travel4.jpg",
    },
  ];

  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <p>
        This is where posts will be shown. Or it will be the landing page. Same
        thing at the end.
      </p>
      <div className="post-container">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            body={post.body}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
