import React, { useState, useEffect } from "react";
import "../styles/CommentsSection.css";
import { useAuth } from "../components/AuthContext.js";

function CommentsSection({ postId, postUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isPublic, setIsPublic] = useState(true); 
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { isAdmin, getUserData } = useAuth();
  const { userId: currentUserId, userRole: currentUserRole } = getUserData();
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);


  const fetchComments = async (users) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/comments-by-post-id?postId=${postId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();

        if(currentUserRole !== "admin" && parseInt(currentUserId) !== postUserId ){
          const filteredComments = data.data.filter(
            (comment) => comment.public || parseInt(currentUserId) === comment.userId
          );
          data.data = filteredComments;
          console.log("Filtered Comments: ", filteredComments);
        }

        data.data.map( (comment) => {
          comment.canEditOrDelete = currentUserRole === "admin" || comment.userId === parseInt(currentUserId)
        } )
        if (Array.isArray(data.data)) {
          const commentsWithUsernames = await Promise.all(
            data.data.map(async (comment) => {
            const userName = users.find( (user) => user.id === comment.userId ).username;
              return {
                ...comment,
                username: userName ? userName : "Unknown user."
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


 const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setUsers(result.data);
        return result.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        alert(`Failed to fetch users: ${error.message}`);
      }
    };

  
useEffect(() => {

  const fetchData = async () => {
    if (postId) {
      const users = await fetchUsers();
      fetchComments(users);
    }
  }
  fetchData();
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
            public: isPublic,
            currentUserId: currentUserId,
            currentUserRole: currentUserRole
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      setNewComment("");
      setIsPublic(true);
      await fetchComments(users);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditComment = async (commentId, userId) => {
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
            public: editIsPublic,            
            currentUserId: parseInt(currentUserId),
            currentUserRole: currentUserRole,
            commentUserId: userId


          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      setEditingCommentId(null);
      setEditCommentText("");
      setEditIsPublic(true);
      await fetchComments(users);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/comments/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            id: commentId,
            currentUserId: parseInt(currentUserId),
            currentUserRole: currentUserRole,
            commentUserId: commentUserId
          
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      await fetchComments(users);
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
        <div className="public-checkbox">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public (uncheck for private)
          </label>
        </div>
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
                    <div className="public-checkbox">
                        <input type="checkbox" checked={editIsPublic}
                          onChange={(e) => setEditIsPublic(!editIsPublic)}
                        />
                      <label>
                        Public (uncheck for private)
                      </label>
                    </div>
                    <button
                      onClick={() => handleEditComment(comment.id, comment.userId)}
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
                    <p>Visibility: {comment.public ? "Public" : "Private"}</p>

                    {comment.canEditOrDelete && (
                    <>
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditCommentText(comment.body);
                        setEditIsPublic(comment.public); // Set the current public/private status
                      }}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id, comment.userId)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                    )}
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
