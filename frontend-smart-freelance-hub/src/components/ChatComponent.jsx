import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the Socket.IO server
const socket = io('http://localhost:3000');

const ChatComponent = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    // Listen for messages from the server
    useEffect(() => {
        socket.on('receiveMessage', (newMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Clean up when the component unmounts
        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    // Handle sending a message
    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('sendMessage', message);
            setMessage(''); // Clear input field after sending
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {chatMessages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
