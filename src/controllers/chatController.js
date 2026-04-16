const Message = require('../models/Message');
const redis = require('../config/redis');

exports.getMessages = async (req, res, next) => {
    try{
        const {room} = req.params;
        const message = await Message.find({room}).populate('sender', 'name')
        .sort({createdAt: -1})
        .limit(50);
        res.json({success: true, data: message});
    }
    catch (err){
        next(err);
    }};



    exports.getActiveRooms = async (req, res, next) => {
        try {
            const rooms = await redis.smembers('activeRooms');
            res.json({success: true, data: rooms});
        } catch (err) {
            next(err);
        }
    };

    