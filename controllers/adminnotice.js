const Notice = require("../models/studmod");
const mongoose = require("mongoose");


exports.createnotice = async (req, res) => {
    try {
        const { title, detail,year,branch} = req.body;

        const createdBy = req.user._id
        
        const newnotice = new Notice({
            title,
            detail,
            year,
            branch,
            // tags,
            createdBy, 
        });
        
        const savednotice = await newnotice.save();

        res.status(201).json({
            success: true,
            message:"NOtice created successfully",
            notice:savednotice,
        });
    } catch (error) {
        console.error("Error while creating notice:", error);
        return res.status(400).json({
            success: false,
            message: "Error while creating notice",
            error: error.message 
        });
    }
};

exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find({});  

        res.status(200).json({
            success: true,
            notices,
        });
    } catch (error) {
        console.error("Error while fetching notices:", error);
        return res.status(400).json({
            success: false,
            message: "Error while fetching notices",
            error: error.message,
        });
    }
};

exports.updateNotice = async (req, res) => {
    try {
        const noticeId = req.params.id; 
        
        if (!mongoose.Types.ObjectId.isValid(noticeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format.",
            });
        }

        const updatedData = req.body;   

        const updatedNotice = await Notice.findByIdAndUpdate(noticeId, updatedData, { new: true });

        if (!updatedNotice) {
            return res.status(404).json({
                success: false,
                message: "Notice not found",
            });
        }
        res.status(200).json({
            success: true,
            notice: updatedNotice,
            message: "Notice updated successfully",
        });
    } catch (error) {
        console.error("Error updating notice:", error);
        return res.status(400).json({
            success: false,
            message: "Error while updating notice",
            error: error.message,  
        });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        const noticeId = req.params.id;

        const deletedNotice = await Notice.findByIdAndDelete(noticeId);

        if (!deletedNotice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notice deleted successfully",
            notice: deletedNotice,
        });
    } catch (error) {
        console.error("Error while deleting notice:", error);
        return res.status(400).json({
            success: false,
            message: "Error while deleting notice",
            error: error.message,
        });
    }
};


