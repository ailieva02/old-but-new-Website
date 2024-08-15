import React from "react";
import { useParams } from "react-router-dom";

function SinglePost() {
  const { id } = useParams();

  return (
    <div>
      <h1>Single Post Page</h1>
      <p>Displaying details for post with ID: {id}</p>
    </div>
  );
}

export default SinglePost;
