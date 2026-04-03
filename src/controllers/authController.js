const jwt = require('jsonwebtoken');
const User = require('../models/users');


const Token =(id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}


exports.register = async (req, res,next) =>{    
    try {
        const { name, email, password } = req.body;


        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }


        const user = await User.create({ name, email, password });
        const token = Token(user._id);

        res.status(201).json({ token });

    } catch (error) {
        next(error);
    }   }