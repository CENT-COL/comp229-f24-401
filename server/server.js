const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// add websockets
const http = require('http');
const { server: WebSocketServer }  = require('websocket');


dotenv.config();

//Instantiate my DB
mongoose.connect(process.env.MONGODB_URL);

//Mongoose error check
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const app = express();

//Add WebSockets Server Features
const server = http.createServer(app);
const wss = new WebSocketServer({httpServer: server});


const clients = []
const getUniqueId = () => {
    const s4 = () => Math.floor((1+Math.random())*0x100000).toString(16).substring(1);
    return s4() + s4() + `'` + s4(); // return a unique id sample XXXXXXXX-XXXX
};

wss.on('request', (request) => {
    const userID = getUniqueId();
    console.log(new Date() + "Received a new connection from origin " + request.origin + ".");

    try {
        const connection = request.accept(null, request.origin);
        clients[userID] = connection;
        console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`);
        
        connection.on('message', (message) => {
            console.log('Received Message', message);
            
            if(message.type === 'utf8') {
                console.log('Received Message', message.utf8Data);
                for(let key in clients){
                    clients[key].sendUTF(message.utf8Data);
                    console.log('Sent Message to: ', clients[key]); 
                }
            }
        });
        connection.on('close', (reasonCode, description) => {
            delete clients[userID];
            console.log((`Client ${userID} has disconnected. Reason: ${reasonCode} - ${description}`));
        
            if(reasonCode=== 1006){
                console.error('Socket Error: read ECONNRESET');
            }
        })
    } catch (error) {
        console.log("Error accepting connection: ", error); 
    }
});


const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// Routes
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

app.use('/api/data', (req, res) => {
    res.json({message: 'Hello from server'});
})


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });