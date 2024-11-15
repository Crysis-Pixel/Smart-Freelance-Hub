import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

const ChatBox = ({ isOpen, onClose, email }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [user, setUser] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  const senderId = loggedInUser?.email;
  const recipientIdRef = useRef("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const recipientId = email;

  useEffect(() => {
    socket.emit("join", senderId);

    const fetchUser = async (email) => {
      try {
        const response = await fetch("http://localhost:3000/user/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, [email]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipientId) return;
      try {
        const response = await fetch(
          "http://localhost:3000/messages/getMessages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: senderId, recipientId }),
          }
        );
        const data = await response.json();
        setChatMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [senderId, recipientId]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.senderId === recipientIdRef.current) {
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const handleTyping = ({ userId, isTyping }) => {
      if (recipientId && userId === recipientId) {
        setTypingUser(isTyping ? userId : null);
      }
    };

    if (recipientId) {
      socket.on("typing", handleTyping);
    }

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [recipientId]);

  const handleTyping = async (e) => {
    setMessage(e.target.value);

    if (recipientId) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", {
          userId: senderId,
          recipientId,
          isTyping: true,
        });
      }
      if (e.target.value === "") {
        setIsTyping(false);
        socket.emit("typing", {
          userId: senderId,
          recipientId,
          isTyping: false,
        });
      }
      setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          socket.emit("typing", {
            userId: senderId,
            recipientId,
            isTyping: false,
          });
        }
      }, 4000);
    }
  };

  const sendMessage = async () => {
    if ((message.trim() !== "" || selectedFile) && recipientId) {
      const formData = new FormData();
      formData.append("senderId", senderId);
      formData.append("receiverId", recipientId);
      formData.append("messageText", message);
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }
      formData.append("isRead", false);

      const response = await fetch("http://localhost:3000/messages/create", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();
      const newMessage = {
        _id: responseData.lastId,
        senderId,
        recipientId,
        messageText: message,
        attachment: selectedFile ? responseData.attachmentName : null,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      socket.emit("sendMessage", newMessage);
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typingUser]);

  const gotoPayment = async () => {
    const checkifPaymentExists = async () => {
      const response = await fetch("http://localhost:3000/payments/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useremail: senderId }),
      });
      const result = await response.json();
      console.log(result);
      if (!(result.message === "Payment not found")) {
        sessionStorage.setItem("paymentreciever", recipientId);
        navigate("/TransactionPage");
      } else {
        alert("You do not have payment set up. Please set payment details.");
        navigate("/PaymentPage");
      }
    };
    checkifPaymentExists();
  };

  useEffect(() => {
    recipientIdRef.current = recipientId;
  }, [recipientId]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFileUpload = () => {
    document.getElementById("file-input").click();
    setDropdownOpen(false);
  };

  const handleGivePayment = () => {
    gotoPayment();
    setDropdownOpen(false);
  };

  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
  const [timestampVisibleIndex, setTimestampVisibleIndex] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredMessageIndex(index);
    const timeoutId = setTimeout(() => {
      setTimestampVisibleIndex(index);
    }, 500);

    setHoverTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    setHoveredMessageIndex(null);
    setTimestampVisibleIndex(null);
    clearTimeout(hoverTimeout);
  };

  return (
    isOpen && (
      <div
        className="fixed bottom-0 right-0 w-80 bg-gray-800 rounded-lg shadow-lg m-4"
        style={{ marginRight: "100px" }}
      >
        <header className="flex justify-between items-center p-3 bg-greenPrimary rounded-t-lg">
          <h2 className="text-white text-lg">
            {user[0]?.firstName || "first name"}{" "}
            {user[0]?.lastName || "last name"}
          </h2>
          <button onClick={onClose} className="text-white">
            X
          </button>
        </header>
        <div className="flex flex-col p-2">
          <label htmlFor="recipient" className="text-white">
            Recipient: {recipientId}
          </label>
        </div>
        <div className="flex flex-col p-4 h-80 overflow-y-auto bg-gray-900 rounded-b-lg">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-2 rounded-lg ${
                msg.senderId === senderId
                  ? "bg-greenPrimary self-end"
                  : "bg-gray-700 self-start"
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-white">{msg.messageText}</p>
              {msg.attachment && (
                <a
                  href={`http://localhost:3000/uploads/${msg.attachment}`}
                  download
                  className="text-blue-400"
                >
                  Download Attachment
                </a>
              )}
              {timestampVisibleIndex === index && (
                <span className="text-gray-400 text-sm">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              )}
            </div>
          ))}
          {typingUser && (
            <p className="text-gray-400">{typingUser} is typing...</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center p-3 bg-gray-800 border-t border-gray-700 rounded-xl relative">
          <button
            onClick={toggleDropdown}
            className="mr-2 p-2 bg-greenPrimary text-white rounded-md"
          >
            +
          </button>

          {dropdownOpen && (
            <div
              className="absolute left-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-10"
              style={{ transform: "translateY(-90%)" }}
            >
              <button
                onClick={handleFileUpload}
                className="block px-4 py-2 text-white hover:bg-greenPrimary w-full text-left"
              >
                Upload File
              </button>
              {loggedInUser.accountType !== "Freelancer" ? (
                <button
                  onClick={handleGivePayment}
                  className="block px-4 py-2 text-white hover:bg-greenPrimary w-full text-left"
                >
                  Give Payment
                </button>
              ) : null}
            </div>
          )}

          <input
            type="file"
            id="file-input"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="hidden"
          />

          <input
            type="text"
            value={message}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-600 rounded-md bg-gray-900 text-white"
          />

          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-greenPrimary text-white rounded-md"
          >
            →
          </button>
        </div>
      </div>
    )
  );
};

export default ChatBox;
