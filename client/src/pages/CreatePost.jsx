import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // Store Base64 string
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please log in first!");
    navigate("/login");
    return null;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result); 
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      alert("Content cannot be empty");
      return;
    }

    setLoading(true);

    const postData = { content, image };

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <textarea
          className="w-full p-3 border rounded"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-3"
        />
        {image && <img src={image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded" />}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 mt-3 rounded"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
