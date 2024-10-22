import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatComponent = () => {
    const [message, setMessage] = useState(''); //a message variable to store messages in text boxes
    const [chatMessages, setChatMessages] = useState([]); // an array that stores all the chats between two users
    const [recipientId, setRecipientId] = useState(''); // stores recipient
    const [userList, setUserList] = useState([]); //an array that stores all users retrieved from database for dropdown menu
    const [isTyping, setIsTyping] = useState(false); //a boolean to store if user is typing or not
    const [typingUser, setTypingUser] = useState(null); // a value that store which user is typing
    const [selectedFile, setSelectedFile] = useState(null); //stores the file uploaded by user
    const loggedInUser = JSON.parse(sessionStorage.getItem("user")); //session value of current logged in user
    const senderId = loggedInUser?.email; //email of user from session value (email is also unique)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); //a sleep variable used for sleep functions

    useEffect(() => {
        socket.emit('join', senderId); //calls socket join function in socket.js. Triggered when a user joins a socket.
        const fetchUserList = async () => { //gets all users store in database
            try {
                const response = await fetch("http://localhost:3000/user/getUsers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                setUserList(data.filter(user => user.email !== senderId)); //stores the users list retrived from database
            } catch (error) {
                console.error('Failed to fetch user list:', error);
            }
        };
        fetchUserList();
    }, [senderId]);

    useEffect(() => {
        // Initial fetch when the a user opens or selects a chat. Gets all the messages between two users.
        const fetchMessages = async () => {
            if (!recipientId) return;
            console.log("Conversation with " + recipientId + " has been loaded.");
            try {
                const response = await fetch("http://localhost:3000/messages/getMessages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: senderId, recipientId }),
                });
                const data = await response.json();
                setChatMessages(data); //sets the messages between two users retrived from database
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();
    }, [senderId, recipientId]);

    useEffect(() => {
        socket.on('receiveMessage', (newMessage) =>  { //this function checks whether the message recieved is for them and sets it as read if the message is for them.
            console.log("Handle recieve Message called.");
            console.log("newMessage.senderId:", newMessage.senderId);
            //sleep(1000); //sleep gives some time to sync data between two users properly and also avoids race conditions where a constant loop happens.
            if (newMessage.senderId === recipientId) {
                setChatMessages((prevMessages) => [...prevMessages, newMessage]); //appends new messages
                // Automatically mark as read if the recipient is the logged-in user
                console.log("Receive message socket has been called.");
                console.log("newMessage object:" + JSON.stringify(newMessage));
                if (newMessage.recipientId === senderId && !newMessage.isRead) { //checks if message has been set to read, if not then sets it as read.
                    console.log("Found a message that is not Read.");
                    console.log("newMessage object from frontend:" + JSON.stringify(newMessage));
                    markMessageAsRead(newMessage._id, newMessage.senderId);
                }
            }
        });
        
        // Listen for messageRead events to update the local state. A small function that adds confirmation to read messages. Checks whether a message sent by a user is read by the other user
        // It is triggered when user opens a chat. If the chat has unread messages then all are set as read.
        socket.on('messageReadConfirmation', ({ messageId }) => {
            console.log("Previous messages have been set read.");
            setChatMessages((prevMessages) =>
                prevMessages.map((msg) => {
                    // console.log("Message object:", msg);
                    // console.log(MessageId: ${messageId} == msg._id: ${msg._id});
                    if (msg._id === messageId) {
                        return { ...msg, isRead: true };
                    }
                    return msg;
                })
            );
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('messageReadConfirmation');
        };
    }, []);

    const handleTyping = async (e) => { //this function deals with everything regarding notifying users whether the other user is typing
        setMessage(e.target.value);
        const userData = JSON.parse(sessionStorage.getItem("user"));
        const userId = userData.email;

        if (recipientId) {
            if (!isTyping) { //if isTyping is false but user is typing, it is set to true
                setIsTyping(true);
                socket.emit('typing', { userId, recipientId, isTyping: true });
            }
            if (e.target.value === '') { //if text box is empty this means user is not typing
                setIsTyping(false);
                socket.emit('typing', { userId, recipientId, isTyping: false });
            }
            setTimeout(() => { //a timeout delay function that makes the 'user is typing...' text disappear after 4 seconds
                if (isTyping) {
                    setIsTyping(false);
                    socket.emit('typing', { userId, recipientId, isTyping: false });
                }
            }, 4000); // the delay time
        }
    };

    const markMessageAsRead = async (messageId, senderId) => { //the function that sets a message as read if the other user has read it
        await sleep(1000); //a delay to prevent race conditions resulting in looping.
        console.log(`Socket function to update message as read has been called. messageId: ${messageId}`);
        socket.emit('messageRead', { messageId, senderId }); //backend socket function that sets message as read is called here.
    };

    const sendMessage = async () => { //this function is called when user sends a message
        if ((message.trim() !== '' || selectedFile) && recipientId) {
            const formData = new FormData(); //all message data is put into a form
            formData.append('senderId', senderId);
            formData.append('receiverId', recipientId);
            formData.append('messageText', message);
            if (selectedFile) {
                formData.append('attachment', selectedFile);
            }
            formData.append('isRead', false);
    
            const response = await fetch("http://localhost:3000/messages/create", { //new message is updated in database
                method: "POST",
                body: formData,
            });
            const responseData = await response.json();
            const lastid = responseData.lastId; //last inserted message ID
            console.log("Inserted lastId: " + lastid);
            // console.log("selected file from frontend: ", formData.get('attachment').lastModifiedDate.toTimeString());
            // console.log(responseData);

            const newMessage = { //a simple message format
                _id: lastid,
                senderId, // Your user ID
                recipientId: recipientId, // The recipient ID selected from the dropdown
                messageText: message,
                attachment: selectedFile ? responseData.attachmentName : null,   // If there's any
                timestamp: new Date().toISOString(),
                isRead: false,
            };

            // Emits the message to the server
            socket.emit('sendMessage', newMessage);

            console.log("newMessage from sendMessage: ", newMessage);
            setChatMessages((prevMessages) => [...prevMessages, newMessage]); //appends chat message array for the user that sends a message

            setMessage(''); //makes text box empty
            setSelectedFile(null); //makes file sent variable empty
        }
    };

    useEffect(() => {
        const handleTyping = ({ userId, isTyping }) => { //a simple function that makes sure that user1 does not see user2 typing when user1 is in a chat with user2.
            if (recipientId && userId === recipientId) {
                setTypingUser(isTyping ? userId : null);
            }
        };
    
        if (recipientId) {
            socket.on('typing', handleTyping); //calls handletyping socket fucntion
        }
        return () => {
            socket.off('typing', handleTyping);
        };

    }, [recipientId]);
    
    // When a user opens the chat or views messages
    useEffect(() => {
        chatMessages.forEach((msg) => { //this is called to set all messages as read when user has opened a chat
            if (msg.receiverId === senderId && !msg.isRead) {
                console.log("User has opened chat, all messages have been set to read.");
                markMessageAsRead(msg._id, msg.senderId);
            }
        });
    }, [chatMessages]);
    
    return (
        <>
        <div>
            {/* This header makes it easier to identify which user is logged in */}
            <h2>Chats of {senderId}</h2>
            <div>
                {/* This is a recipient selection dropdown system. Users list from database are taken into userList variable and then displayed here */}
                <label htmlFor="recipient">Select Recipient: </label>
                <select 
                    id="recipient"
                    value={recipientId}
                    // onChange is triggered when a user has selected whom to send a chat
                    onChange={(e) => {
                        console.log("User has selected: ", e.target.value);
                        setRecipientId(e.target.value);//sets the recipientId after selecting
                        }
                    }
                >
                    <option value="">Select a user</option>
                    {userList.map((user) => (
                        <option key={user.email} value={user.email}>
                            {/* users names retrieved from database are set here */}
                            {user.firstName} {user.lastName} ({user.email})
                        </option>
                    ))}
                </select>
            </div>
            
            <div>
                {Array.isArray(chatMessages) && chatMessages.map((msg, index) => (
                    
                    <p key={index} 
                    // style={{ color: msg.isRead ? 'green' : 'black' }} //this can also be used to set nessage text colours for read and unread
                    >
                        {/* You and Them is used to differentiate which message you send and which message they send */}
                        <strong>{msg.senderId === senderId ? 'You' : 'Them'}:</strong> {msg.messageText} 
                        <span>{msg.isRead && msg.senderId === senderId ? '✔' : ''}</span> {/* Adds a checkmark if message is read */} 
                        <span>
                        {" " + new Date(msg.timestamp).toLocaleString('en-US', { //this function converts data to a readable format
                            timeZone: 'Asia/Dhaka',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        })}
                        </span>
                        {/* this is a downloadable link for attachments if they exist in a message */}
                        {msg.attachment && <a href={`http://localhost:3000/uploads/${msg.attachment}`} download> Download Attachment </a>}
                    </p>
                ))}
                {/* this shows if user is typing */}
                {typingUser && <p>{typingUser} is typing...</p>}
            </div>

            <input
                type="text"
                value={message}
                onChange={handleTyping} // handletyping is called if there is activity in text box
                placeholder="Type your message..."
            />

            {/* this is for file inputs */}
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            
            {/* sendMessage function is triggered when button is pressed */}
            <button onClick={sendMessage}>Send</button>
        </div>
    </>
    );
};

export default ChatComponent;