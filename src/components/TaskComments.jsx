import { useEffect, useState } from "react";
import axios from "axios";

const TaskComments = ({ socket, taskId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // send JWT token
    },
  };

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}/comments`,
          config
        );
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [taskId]);

  // Listen for new comments
  useEffect(() => {
    if (!socket) return;

   const handleNewComment = (comment) => {
  if (comment.taskId === taskId) {
    setComments((prev) => {
      // Prevent duplicates by checking _id
      if (prev.some(c => c._id === comment._id)) return prev;
      return [...prev, comment];
    });
  }
};
         

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [socket, taskId]);

  // Send comment
  // Send comment
const sendComment = async () => {
  if (!message.trim()) return;

  try {
    await axios.post(
      `http://localhost:5000/api/tasks/${taskId}/comments`,
      {
        user: currentUser,
        message,
      },
      config
    );
    setMessage(""); // Clear input
    // DO NOT manually add comment to state — socket will handle it
  } catch (err) {
    console.error("Failed to send comment:", err);
  }
};


  return (
    <div className="p-2 border rounded mt-2">
      <h3 className="font-bold mb-2">Comments</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((c) => (
          <div key={c._id} className="bg-gray-100 p-1 rounded">
            <span className="font-semibold">{c.user}: </span>
            {c.message}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <input
          className="border rounded p-1 flex-1"
          placeholder="Type a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-3 ml-2 rounded"
          onClick={sendComment}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TaskComments;
