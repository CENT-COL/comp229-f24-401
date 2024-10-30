const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

//Instantiate my DB
mongoose.connect(process.env.MONGODB_URL);

//Mongoose error check
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const app = express();
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});