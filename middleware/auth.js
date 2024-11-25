const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const admin = require("../models/adminmod");
const notice=require("../models/studmod");
require("dotenv").config();

exports.auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing, please log in first.",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            let user;
            if (req.user.role === "admin") {
                user = await admin.findOne({ teacherId: req.user.teacherId });
            } else if (req.user.role === "user"){
                user = await User.findOne({ rollNumber: req.user.rollNumber });
            }
        else {
            return res.status(403).json({
                success: false,
                message: "Invalid role.",
            });
        }
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            req.user = user; 
            next(); 
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token, please log in again.",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during authentication.",
        });
    }
};

exports.roleCheck = (requiredRole) => {
    return (req, res, next) => {
        try {
            if (req.user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access restricted to ${requiredRole}s only.`,
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while checking role.",
            });
        }
    }
};