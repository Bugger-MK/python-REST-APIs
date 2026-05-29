// src/app.js
const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');


const app = express();
app.use(express.json());



app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);   
app.use('/api/chat', chatRoutes);
app.use(errorHandler);   // must be LAST

module.exports = app;