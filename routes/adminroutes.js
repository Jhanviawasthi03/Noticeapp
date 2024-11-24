const express = require("express");
const router = express.Router();
const { auth, roleCheck } = require("../middleware/auth");
const {
    createnotice,
    getAllNotices,
    updateNotice,
    deleteNotice
} = require("../controllers/adminnotice");

router.post("/create", auth, roleCheck("admin"), createnotice);
router.put("/update/:id", auth, roleCheck("admin"), updateNotice);
router.delete("/delete/:id", auth, roleCheck("admin"), deleteNotice);
router.get("/",auth,roleCheck("admin"), getAllNotices)

module.exports = router;
