import { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedImage, setEditedImage] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    fetchPosts();
    checkUserLoggedIn();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts`);
      const data = await response.json();
      console.log("Fetched Posts:", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const checkUserLoggedIn = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.token) {
      setUser(storedUser);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      } else {
        console.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (response.ok) {
        setCommentText("");
        setCommentingPostId(null);
        fetchPosts();
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
    setEditedImage(post.image || "");
  };

  const handleSaveEdit = async (postId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ content: editedContent, image: editedImage }),
      });

      if (response.ok) {
        setEditingPostId(null);
        fetchPosts();
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        fetchPosts();
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Latest Posts</h2>
        {user && (
          <Link
            to="/create"
            className="bg-green-500 text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-green-600"
          >
            <FaPlus /> Add Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="w-[500px] bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{post.user?.username || "Unknown User"}</h3>

              {user && post.user?._id === user._id && (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(post)} className="text-gray-500 hover:text-gray-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeletePost(post._id)} className="text-red-500 hover:text-red-800">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            {editingPostId === post._id ? (
  <div className="mt-3 bg-gray-100 p-2 rounded">
    <textarea
      className="border p-2 w-full"
      value={editedContent}
      onChange={(e) => setEditedContent(e.target.value)}
    />
    
    <input
      type="file"
      accept="image/*"
      className="border p-2 w-full mt-2"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setEditedImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }}
    />

    {editedImage && <img src={editedImage} alt="Preview" className="w-full h-40 object-cover mt-2 rounded-md" />}

    <button className="bg-green-500 text-white px-4 py-2 rounded mt-2" onClick={() => handleSaveEdit(post._id)}>
      Save
    </button>
    <button className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2" onClick={() => setEditingPostId(null)}>
      Cancel
    </button>
  </div>
) : (
  <>
    <p className="text-gray-700 my-2">{post.content}</p>
    {post.image && <img src={post.image} alt="Post" className="w-full h-64 object-cover rounded-md my-2" />}
  </>
)}


            <div className="flex items-center space-x-4 mt-3">
              <button className="text-blue-500 flex items-center gap-1" onClick={() => handleLike(post._id)}>
                <BiSolidLike /> {post.likes?.length || 0} Likes
              </button>

              <button
                className="text-green-500 flex items-center gap-1"
                onClick={() => setCommentingPostId(commentingPostId === post._id ? null : post._id)}
              >
                💬 {post.comments?.length || 0} Comments
              </button>
            </div>

            {commentingPostId === post._id && (
              <div className="mt-3">
                <div className="mt-2">
                  {Array.isArray(post.comments) &&
                    post.comments.map((comment, index) => (
                      <p key={index} className="bg-gray-200 p-2 rounded mt-1">
                        <strong>{comment.user?.username || "Anonymous"}:</strong> {comment.text}
                      </p>
                    ))}
                </div>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={() => handleCommentSubmit(post._id)}>
                  Post Comment
                </button>

              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
