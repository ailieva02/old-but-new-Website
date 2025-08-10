import React, { useState, useEffect } from "react";
import "../styles/CommentsSection.css";

function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/comments-by-post-id?postId=${postId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();

      if (Array.isArray(data.data)) {
        const commentsWithUsernames = await Promise.all(
          data.data.map(async (comment) => {
            const userResponse = await fetch(
              `${process.env.REACT_APP_API}/api/users/${comment.userId}`
            );
            const userData = await userResponse.json();
            return {
              ...comment,
              username:
                userData.success && Array.isArray(userData.data)
                  ? userData.data[0].username
                  : "Unknown user",
            };
          })
        );
        setComments(commentsWithUsernames);
      } else {
        setComments([]);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/comments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            userId: sessionStorage.getItem("userId"),
            body: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      setNewComment("");
      await fetchComments();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/comments/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: commentId,
            body: editCommentText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      setEditingCommentId(null);
      setEditCommentText("");
      await fetchComments();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/comments/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: commentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      await fetchComments();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="comments-section">
      <h2>Comments</h2>
      {error && <p className="error">{error}</p>}
      <div className="new-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a new comment"
          rows="4"
        ></textarea>
        <button onClick={handleAddComment} className="add-comment-button">
          Add Comment
        </button>
      </div>
      <ul className="comments-list">
        {comments.length === 0 ? (
          <p>No comments available</p>
        ) : (
          comments.map((comment) =>
            comment && comment.id ? (
              <li key={comment.id} className="comment-item">
                {editingCommentId === comment.id ? (
                  <div className="edit-comment">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      rows="4"
                    ></textarea>
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="comment-content">
                    <p>{comment.body}</p>
                    <p>Posted by: {comment.username}</p>
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditCommentText(comment.body);
                      }}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li key="no-comment">Comment data is missing</li>
            )
          )
        )}
      </ul>
    </div>
  );
}

export default CommentsSection;
