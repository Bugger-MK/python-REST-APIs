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

        res.status(201).json({success : true,data:{id:user._id,name:user.name, email:user.email}, token });

    } catch (error) {
        next(error);
    }   }



exports.login = async (req, res,next) =>{
    try{
        const { email, password } = req.body; 
        
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
       
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = signToken(user._id);

        res.json({success: true,token, data:{id:user._id,name:user.name,email:user.email} });
    }
    catch(error){
        next(error);
    }}


    exports.getMe = async (req, res,next) =>{
       res.json({success: true, data: req.user});