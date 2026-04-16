const express = require('express');
const router = express.Router();
const { getMessages, getActiveRooms } = require('../controllers/chatController');
const protect = require('../middleware/protect');

router.get('/rooms', protect, getActiveRooms);
router.get('/:room/messages', protect, getMessages);

module.exports = router;