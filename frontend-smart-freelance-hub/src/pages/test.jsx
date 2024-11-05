import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBox from "../components/ChatBox";

function Test() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const notify = () => {
    toast("Hello, World!");
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        onClick={notify}
        className="p-3 bg-blue-500 text-white rounded mb-4"
      >
        Show Toast
      </button>
      <button
        onClick={toggleChat}
        className="p-3 bg-green-500 text-white rounded"
      >
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </button>
      <ChatBox isOpen={isChatOpen} onClose={toggleChat} />
    </div>
  );
}

export default Test;
