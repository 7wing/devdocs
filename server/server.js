const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const postRoutes = require('./routes/postRoutes'); 
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes); 
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.status(200).send('API is running!');
});

const mongoUri = process.env.MONGO_URI; 
if (!mongoUri) {
    console.error("❌ MONGODB_URI not set!");
} else {
    mongoose.connect(mongoUri)
        .then(() => console.log('✅ MongoDB connected successfully.'))
        .catch(err => console.error('❌ MongoDB connection error:', err.message));
}

module.exports = app;