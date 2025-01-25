const User=require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const Otp=require("../models/otpModel");
const moment = require('moment');
const otpGenerator=require("../utils/OtpGeneration");
const mailSender=require("../utils/mailSender");
exports.signup = async (req, res) => {
    try {
        let { email, password, name, phone } = req.body;
        if (!email || !password || !name || !phone) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        email = email.toLowerCase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.isVerified) {
                const otp = otpGenerator();
                const existingOtp = await Otp.findOne({ email });
                if (existingOtp) {
                    await Otp.updateOne(
                        { email },
                        {
                            otp,
                            createdAt: new Date(),
                            expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
                        }
                    );
                } else {
                    await Otp.create({
                        email,
                        otp,
                        createdAt: new Date(),
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
                    });
                }
                const content = `Dear ${name},\n\nYour OTP for signup is ${otp}. It is valid for 10 minutes.\n\nThank you!`;   
                await mailSender(email, 'Please verify your email ', otp, content);
                return res.status(200).json({
                    message: "User already exists but is not verified. A new OTP has been sent to your email.",
                    email,
                    success: true,
                });
            }
            return res.status(400).json({
                message: "User already exists. Please login.",
                success: false,
            });
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "Internal error during password hashing",
            });
        }
        const otp = otpGenerator();
        await Otp.create({
            email,
            otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
        });
        const content = `Dear ${name},\n\nYour OTP for signup is ${otp}. It is valid for 10 minutes.\n\nThank you!`;
        await mailSender(email, otp, content);

        await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "Normal",
            isVerified: false, 
        });

        return res.status(200).json({
            message: "User signed up successfully. Please verify your OTP.",
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: e,
        });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email not found",
                success: false,
            });
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found or expired",
                success: false,
            });
        }
        
        const currentTime = moment().valueOf();
        const otpExpiryTime = moment(otpRecord.expiresAt).valueOf();
        console.log(otp," diff ",otpRecord.otp);
        console.log(currentTime," diff ",otpExpiryTime)
        if (currentTime > otpExpiryTime || otpRecord.otp !== otp) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User is already verified",
                success: false,
            });
        }

        await User.updateOne({ email }, { isVerified: true });
        await Otp.deleteOne({ email });
        return res.status(200).json({
            message: "OTP verified successfully. User is now verified.",
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: e.message,
        });
    }
};

exports.login=async(req,res)=>{
   try{
     let {email,password}=req.body
     if(!email||!password){
        return res.status(400).json({
            message:"All feild Required",
            success:false
        })
     }
    email=email.toLowerCase();
    const user = await User.findOne({ email });
        if (!user||!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "No user available",
        })
    }
    
    const payload = {
        email: user.email,
        id: user._id,
        role: user.role
    }
    if (await bcrypt.compare(password, user.password)) {
        let token = jwt.sign(payload, "asdfdsdfd", {
            expiresIn: "720h"
        });
        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }
        user.password = undefined;
        req.token = token;
        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User login",
            token,
            user
        })
    }else{
        return res.status(400).json({
            success:false,
            message:"Incorrect Email or Password",
        })
    }
   }catch(e){
       return res.status(400).json({
        success:false,
        message:"Something went wrong",
        error:e.message
       })
   } 
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const result = await User.findByIdAndDelete(id); 
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", data: result });
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { email } = req.params; 
        const { name, phone } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required in params" });
        }
        if (!name && !phone) {
            return res.status(400).json({ message: "At least one field (name or phone) is required to update" });
        }
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { ...(name && { name }), ...(phone && { phone }) } }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (e) {
        console.error("Error updating user:", e);
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, 
            sameSite: 'strict', 
        });
        return res.status(200).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: e.message,
        });
    }
};
