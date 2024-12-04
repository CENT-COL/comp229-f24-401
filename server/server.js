const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
// const path = require('path');

// adding websockets
const http = require('http');
const { server: WebSocketServer, client } = require('websocket');

dotenv.config();

//Instantiate my DB
mongoose.connect(process.env.MONGODB_URL);

//Mongoose error check
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const app = express();


// Add Websockets features
const server = http.createServer(app);
const wss = new WebSocketServer({ httpServer: server });

const initializeChat = require('./utils/chat');

let chat; // Placeholder for chat instance
initializeChat()
    .then((initilizedChat) => {
        chat = initilizedChat;
    })
    .catch((error) => {
        console.error('Failed to initialize chat instance:', error);
    })

const clients = [];
const getUniqueId = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4(); // unique id XXXXXXXX-XXXX
}

wss.on('request', (request) => {
    const userID = getUniqueId();
    console.log(`New connection: ${userID}`);

    try {
        const connection = request.accept(null, request.origin);
        clients[userID] = connection;
        connection.on('message', async (message) => {
            try {
                if (!chat) {
                    console.error('Chat model is not initialized yet. Unable to process the message.');
                    return;
                }

                if (message.type === 'utf8') {
                    const messageData = JSON.parse(message.utf8Data);
                    console.log('Received Message:', messageData);

                    // Broadcast the user's message to all clients
                    Object.keys(clients).forEach((clientID) => {
                        clients[clientID].sendUTF(
                            JSON.stringify({
                                type: 'message',
                                msg: messageData.msg,
                                user: messageData.user,
                            })
                        );
                    });

                    // If the message includes "google," generate a response from GenAI
                    if (messageData.msg.toLowerCase().includes('@ai')) {

                        const sanitizedMessage = messageData.msg.replace(/@ai/gi, '').trim();

                        console.log('Sanitized Message:', sanitizedMessage);



                        try {
                            console.log("message Data", messageData.msg);
                            const response = await chat.sendMessage(sanitizedMessage);
                            console.log(response.response.text());
                            const aiResponse = response.response?.text() || 'No response generated by AI.';

                            console.log('AI Response:', aiResponse);

                            // Send the AI response back to all connected clients
                            Object.keys(clients).forEach((clientID) => {
                                clients[clientID].sendUTF(
                                    JSON.stringify({
                                        type: 'message',
                                        msg: aiResponse,
                                        user: '@ai',
                                    })
                                );
                            });

                            console.log(`AI Response sent to all clients: ${aiResponse}`);
                        } catch (error) {
                            console.error('Error generating AI response:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        connection.on('close', (reasonCode, description) => {
            delete clients[userID];

            if (reasonCode === 1006) {
                console.error('Socket Error: read ECONNRESET');
            }
        });

    } catch (error) {
        console.log("Error accepting connection: ", error);

    }
})


const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// Routes
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

app.use('/api/data', (req, res) => {
    res.json({ message: 'Hello from server' });
})

// Serve static assets for production
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });