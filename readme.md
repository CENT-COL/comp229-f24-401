 Class Guide: Implementing Unit and End-to-End Testing in a MERN Project
 ## 1. Introduction to Testing
 - **What is Testing?**
   - Testing ensures your application behaves as expected.
   - Two types we’ll cover:
     - **Unit Tests**: Focus on individual pieces of logic (e.g., a function or API endpoint).
     - **End-to-End (E2E) Tests**: Validate user workflows by simulating real interactions.
 - **Why Refactor the Server?**
   - Clean separation of concerns:
     - `app.js`: Contains Express app logic (routes, middleware, etc.).
     - `server.js`: Handles server startup (e.g., WebSockets, HTTP server).
   - Makes unit testing easier by importing the app instance without starting the server.
 ## 2. Refactoring the Server
 ### Step 1: Create `app.js`
 Move all Express-specific logic to a new file, `app.js`. This includes routes, middleware, and database initialization.
 **File: `server/app.js`**
 ```javascript
 const express = require('express');
 const cors = require('cors');
 const mongoose = require('mongoose');
 const path = require('path');
 require('dotenv').config();

 const app = express();

 // Database connection
 mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
 const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 db.once('open', () => console.log('Connected to Database'));

 // Middleware
 app.use(cors());
 app.use(express.json());

 // Routes
 const projectRoutes = require('./routes/projects');
 const userRoutes = require('./routes/users');

 app.use('/api/projects', projectRoutes);
 app.use('/api/users', userRoutes);

 // Serve static assets in production
 if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/dist')));
     app.get('*', (req, res) => {
         res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
     });
 }

 module.exports = app;
 ```
 ### Step 2: Simplify `server.js`
 This file is now only responsible for starting the server and setting up WebSockets or other server-level features.
 **File: `server/server.js`**
 ```javascript
 const http = require('http');
 const app = require('./app'); // Import the Express app
 const { server: WebSocketServer } = require('websocket');
 const initializeChat = require('./utils/chat');

 // Create the HTTP server
 const server = http.createServer(app);

 // WebSocket setup
 const wss = new WebSocketServer({ httpServer: server });

 let chat;
 initializeChat()
     .then((initializedChat) => {
         chat = initializedChat;
     })
     .catch((error) => console.error('Failed to initialize chat:', error));

 const clients = {};
 const getUniqueId = () => Math.random().toString(36).substring(2, 15);

 wss.on('request', (request) => {
     const userId = getUniqueId();
     const connection = request.accept(null, request.origin);
     clients[userId] = connection;

     connection.on('message', async (message) => {
         if (!chat) return console.error('Chat not initialized');
         // Handle chat message logic...
     });

     connection.on('close', () => {
         delete clients[userId];
     });
 });

 // Start the server
 const PORT = process.env.PORT || 3000;
 server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 ```
 ### Step 3: Benefits
 - **For Unit Tests**:
   - Import the `app` directly in test files without triggering the WebSocket server or other server-level features.
 - **For E2E Tests**:
   - The separation keeps the server logic clean, allowing easier focus on frontend-backend interaction.
 ## 3. Unit Testing the Backend
 ### Writing Unit Tests
 - Example Test for `/api/projects` (same as before):
 ```javascript
 const mockingoose = require('mockingoose');
 const Project = require('../models/projects');
 const request = require('supertest');
 const app = require('../app'); // Import the app, not the server

 describe('GET /api/projects', () => {
     it('should return a list of projects', async () => {
         mockingoose.Project.toReturn([
             { _id: '1', name: 'Project 1', description: 'Description 1' },
             { _id: '2', name: 'Project 2', description: 'Description 2' },
         ], 'find');

         const response = await request(app).get('/api/projects');

         expect(response.status).toBe(200);
         expect(response.body).toHaveLength(2);
     });
 });
 ```
 ### Run the Tests
 ```bash
 npm test
 ```
 ## 4. End-to-End Testing with Cypress
 ### Setting Up Cypress
 1. **Install Cypress**:
 ```bash
 npm install --save-dev cypress
 ```
 2. **Configure Cypress**:
 Create `cypress.config.js`:
 ```javascript
 module.exports = {
     e2e: {
         baseUrl: 'http://localhost:3000',
     },
 };
 ```
 ### Adding Data Attributes for Testing
 - Update JSX to include `data-cy` attributes for stable selectors.
 **Example: `project-item`**
 ```jsx
 <table data-cy="project-list">
     {projects.map((project) => (
         <tr data-cy="project-item" key={project._id}>
             <td>{project.name}</td>
         </tr>
     ))}
 </table>
 ```
 ### Writing E2E Tests
 - Example Test for the Projects Page:
 ```javascript
 describe('Projects Page', () => {
     beforeEach(() => {
         cy.visit('/projects');
     });

     it('should display a list of projects', () => {
         cy.intercept('GET', '/api/projects', [
             { _id: '1', name: 'Mock Project 1', description: 'Mock Description 1' },
             { _id: '2', name: 'Mock Project 2', description: 'Mock Description 2' },
         ]).as('getProjects');

         cy.wait('@getProjects');
         cy.get('[data-cy="project-list"]').should('exist');
         cy.get('[data-cy="project-item"]').should('have.length', 2);
     });

     it('should display an empty state if no projects are available', () => {
         cy.intercept('GET', '/api/projects', []).as('getProjects');
         cy.wait('@getProjects');
         cy.get('[data-cy="empty-state"]').should('contain', 'No projects available');
     });
 });
 ```
 ### Run E2E Tests
 1. Start the backend (`server/server.js`) and frontend (`client`):
 ```bash
 npm start
 ```
 2. Run Cypress:
 ```bash
 npx cypress open
 ```
 ## 5. Summary of Key Steps
 1. **Refactor the Server**:
    - Separate `app.js` (Express logic) and `server.js` (server logic).
 2. **Unit Tests**:
    - Mock the database using `mockingoose`.
    - Test API endpoints directly with `supertest`.
 3. **E2E Tests**:
    - Use Cypress to simulate user workflows.
    - Mock API responses with `cy.intercept`.