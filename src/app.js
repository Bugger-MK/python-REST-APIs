// src/app.js
const express = require('express');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/api/todos', todoRoutes);
app.use(errorHandler);   // must be LAST

module.exports = app;