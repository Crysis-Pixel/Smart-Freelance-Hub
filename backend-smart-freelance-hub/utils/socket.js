// socket.js

const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const users = {}; // Store connected users

// Initialize function to set up Socket.IO
const initializeSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a user joins, save their userID and socketID
    socket.on('join', (userId) => {
        users[userId] = socket.id;
        console.log(`User ${userId} is now connected with socket ID: ${socket.id}`);
    });

    socket.on('typing', ({ userId, recipientId, isTyping }) => {
        const recipientSocketId = users[recipientId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('typing', { userId, isTyping });
        }
    });

    // Listen for private messages
    socket.on('sendMessage', async ({ _id, senderId, recipientId, messageText, attachment, isRead }) => {
        console.log(`Message from ${senderId} to ${recipientId}: ${messageText}`);

        const timestamp = new Date(); // Get current timestamp

        const messageData = {
            _id : _id,
            senderId,
            recipientId,
            messageText,
            timestamp: timestamp.toISOString(), // Convert to ISO format
            attachment: attachment ? path.basename(attachment) : null,
            isRead: isRead
        };
        
        // // Handle file attachment if provided
        // let savedAttachment = null;
        // if (attachment) {
        //     console.log("Attachment recieved to server: ", attachment);
        //     try{
        //         // const buffer = Buffer.from(attachment, 'base64');
        //         // const filePath = path.join(__dirname, 'uploads', attachment);
        //         // fs.writeFileSync(filePath, buffer);
        //         // savedAttachment = filePath;
        //     } catch (error){
        //         console.error("Error saving attachment:", error);
        //     }
        // } else {
        //     console.error("invalid attachment data: ", attachment);
        // }

        const recipientSocketId = users[recipientId];
        const senderSocketId = users[senderId];
        console.log("recipientSocketId: ",recipientSocketId);
        console.log("senderSocketId: ",senderSocketId);
        if (recipientSocketId) {
            console.log("New Message Data: " + JSON.stringify(messageData))
            io.to(recipientSocketId).emit('receiveMessage', messageData);
        }
        io.to(senderSocketId).emit('receiveMessage', messageData);

        //////
    });
    
    socket.on('receiveMessage', async (newMessage) => {
        // Save message and update `read` status
        const response = await collection.updateOne(
            { _id: newMessage._id },
            { $set: { isRead: true } }
        );
        console.log("Response : " + response);
        console.log("newMessage at backend:" + newMessage);
        io.to(senderSocketId).emit('messageRead', { messageId: newMessage._id, senderId: newMessage.senderId });
    });

    // Listen for messageRead event
    socket.on('messageRead',async ({ messageId, senderId }) => {

        // Update the message status in the database
        await markMessageAsReadInDB(messageId);
        console.log("Updated database message id: " + messageId);

        console.log(users);
        console.log("Sender ID:" + senderId);
        console.log("Message ID:" + messageId);
        const senderSocketId = users[senderId];
        console.log("Sender Socket ID: " + senderSocketId);
        if (senderSocketId) {
            // Notify the sender that the message was read
            console.log("Emitting confirmation for read.");
            io.to(senderSocketId).emit('messageReadConfirmation', { messageId });
        }
    });

    const markMessageAsReadInDB = async (messageId) => {
        try {
            await fetch("http://localhost:3000/messages/markAsRead", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: messageId }),
            });
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        // Remove user from the users object
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
    });
});

return io;
};

module.exports = initializeSocket;