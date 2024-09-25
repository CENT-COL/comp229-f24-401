const express = require('express');
const mongoose = require('mongoose');

//Instantiate my DB
mongoose.connect('mongodb://localhost:27017/mern', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
const projectRoutes = require('./routes/projects');

app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});