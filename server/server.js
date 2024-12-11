// Path: server/server.js
const http = require('http');
const app = require('./app'); // Import the app instance
const { server: WebSocketServer } = require('websocket');
const initializeChat = require('./utils/chat');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// WebSocket initialization
const wss = new WebSocketServer({ httpServer: server });

let chat;
initializeChat()
    .then((initializedChat) => {
        chat = initializedChat;
    })
    .catch((error) => console.error('Failed to initialize chat instance:', error));

const clients = [];
const getUniqueId = () => Math.random().toString(36).substring(2, 15);

wss.on('request', (request) => {
    const userID = getUniqueId();
    console.log(`New connection: ${userID}`);
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;

    connection.on('message', async (message) => {
        if (!chat) return console.error('Chat is not initialized');
        if (message.type === 'utf8') {
            // Handle message logic
        }
    });

    connection.on('close', () => {
        delete clients[userID];
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});