import User from "../Models/UserModel.js";
import { createSecretToken } from "../utils/SecretToken.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

export const Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.json({message:'All fields are required'})
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'This Email does not exist' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password. Please try again.' }) 
      }
       const token = createSecretToken(user._id);
       res.cookie("token", token, {
         withCredentials: true,
         sameSite: 'None',
         httpOnly: false,
       });
       res.status(201).json({ message: "User logged in successfully", success: true });
       next()
    } catch (error) {
      console.error(error);
    }
  }

export const Signup = async (req, res, next) => {
  try {
    const { email, password, username, isAdmin, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, isAdmin, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

export const Logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "User logged out successfully" });
};

export const Reset = async (req, res) => {
  try {
    console.log("Reset password process started");
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "No user with that Email found." });
    }

    const hashedToken = crypto.randomBytes(32).toString("hex");
    
    existingUser.resetPasswordToken = hashedToken;
    existingUser.resetPasswordExpires = Date.now() + 1800000; // 30 mins
    await existingUser.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: existingUser.email,
      from: "no-reply@seedstake.com",
      subject: "Password Reset | SeedStake",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset/${hashedToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Password reset email sent successfully" });
    });
  } catch (error) {
    console.error("Error in password reset process:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const Update = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  
  try {
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error("Error in password update process:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
