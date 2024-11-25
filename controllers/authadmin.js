const bcrypt = require("bcrypt");
const admin = require("../models/adminmod.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const notice=require("../models/studmod");

exports.signupAdmin = async (req, res) => {
    try {
        const { username, email, teacherId, password, profilePicture } = req.body;

        // const existingUser = await admin.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Admin already exists",
        //     });
        // }

        const existingTeacherId = await admin.findOne({ teacherId });
        if (existingTeacherId) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID already registered",
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            });
        }

        const newAdmin = await admin.create({
            username,
            teacherId,
            email,
            password: hashedPassword,
            profilePicture,
            role: "admin", 
            rollNumber: undefined,
            isAdmin: true,
        });
        await newAdmin.save();

        return res.status(200).json({
            success: true,
            message: "Admin created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Admin cannot be registered, please try again later",
        });
    }
};




exports.loginAdmin = async (req, res) => {
    try {
        const { teacherId, password } = req.body;

        if (!teacherId || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        let adminUser = await admin.findOne({ teacherId });
        if (!adminUser) {
            return res.status(400).json({
                success: false,
                message: "Admin is not registered",
            });
        }

        if (await bcrypt.compare(password, adminUser.password)) {
            const payload = {
                teacherId: adminUser.teacherId,
                role: adminUser.role,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            adminUser = adminUser.toObject();
            adminUser.token = token;
            adminUser.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                adminUser,
                message: "Admin logged in successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Password incorrect",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure",
        });
    }
};




exports.logoutAdmin = (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true });

        res.status(200).json({
            success: true,
            message: "Admin logged out successfully",
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};



exports.getAdminProfile = async (req, res) => {
    try {
        const adminProfile = await admin.findOne({ teacherId: req.user.teacherId }).select("-password");

        if (!adminProfile) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        res.status(200).json({
            success: true,
            adminProfile,
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve profile",
        });
    }
};



exports.updateAdminProfile = async (req, res) => {
    try {
        const updatedData = req.body;

        const updatedAdmin = await admin.findOneAndUpdate(
            { teacherId: req.user.teacherId }, 
            updatedData, 
            { new: true }
        ).select("-password");

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        res.status(200).json({
            success: true,
            updatedAdmin,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
