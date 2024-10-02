const express = require('express');
const mongoose = require('mongoose');

//Instantiate my DB
mongoose.connect('mongodb://localhost:27017/mern');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});