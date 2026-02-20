const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const emailService = require("../services/email.service")
const { JWT_SECRET } = require("../config/env");
// const { sendRegisterationEmail } = require("../services/email.service");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {

    
    
     if (!email || !password || !name) {
  return res.status(400).json({ message: "All fields required" });
}

let userExist = await userModel.findOne({
      email: email
    }) 

    if(userExist){
      return res.status(400).json({
        message:"user already exist with this email"
      })
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    // sendRegisterationEmail(user.email, user.name);


    let token = await jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "3d",
    });
    
    console.log(token);
    res.cookie("token",token).status(200).json({
      message: "Login successfull, no need of login...",
      user:{
        user:user._id,
        email:user.email,
        name:user.name
      }})
  } catch (error) {
    console.log("SIGNUP ERROR :", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
   const { email, password } = req.body;
  try {
   
    if (!password) {
      return res.status(400).json({
        message: "password is mandatory",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "email is mandatory",
      });
    }
     
    let user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                message: "User not found ",
            });
        }


    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "WRONG CREADENTIALS...",
      });
    }

    let token = await jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "3d",
    });
    console.log(token);
    res.cookie("token",token).status(200).json({
      message: "Login successfull...",
      user:{
        user:user._id,
        email:user.email,
        name:user.name
      }
    });
    
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
  
 
};
