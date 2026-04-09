const express = require('express');
const { getMessages, getActiveRooms } = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:room/messages', protect, getMessages);
router.get('/active', protect, getActiveRooms);

module.exports = router;



