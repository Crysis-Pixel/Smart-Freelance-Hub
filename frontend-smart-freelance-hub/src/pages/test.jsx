import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBox from "../components/ChatBox"; // Assuming this is used elsewhere
import TopUpModal from "../components/TopUpModal"; // Make sure to import the TopUpModal component

function Test() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notify = () => {
    toast("Hello, World!");
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="p-6">
      <button
        onClick={notify}
        className="p-3 bg-blue-500 text-white rounded mb-4"
      >
        Show Toast
      </button>
      <button
        onClick={toggleChat}
        className="p-3 bg-green-500 text-white rounded mb-4"
      >
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </button>
      <button
        onClick={toggleModal}
        className="p-3 bg-yellow-500 text-white rounded"
      >
        {isModalOpen ? "Close Top-Up Modal" : "Open Top-Up Modal"}
      </button>

      <ChatBox isOpen={isChatOpen} onClose={toggleChat} />
      {isModalOpen && <TopUpModal onClose={toggleModal} />}
    </div>
  );
}

export default Test;
