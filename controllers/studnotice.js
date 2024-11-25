const Notice = require("../models/studmod.js");
const Admin = require("../models/adminmod.js");

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find();

    if (!notices || notices.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notices found",
      });
    }

    const noticesWithAdminDetails = [];

    for (let i = 0; i < notices.length; i++) {
      const admin = await Admin.findById(notices[i].createdBy).select("username email");

      const noticeWithAdmin = {
        ...notices[i].toObject(),
        createdBy: admin,
      };

      noticesWithAdminDetails.push(noticeWithAdmin);
    }

    res.status(200).json({
      success: true,
      notices: noticesWithAdminDetails,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetch",
      error: error.message,
    });
  }
};
      
