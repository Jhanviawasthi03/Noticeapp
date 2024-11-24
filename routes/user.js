const express=require("express");
const router=express.Router();

const{login,signup,logout,getProfile, updateProfile}=require("../controllers/auth");
const { auth, roleCheck } = require("../middleware/auth");


router.get("/profile", auth, roleCheck("user"), getProfile);
router.put("/profile", auth, roleCheck("user"), updateProfile);
router.post("/login",login);
router.post("/signup",signup);
router.post("/logout",logout);

const { loginAdmin, signupAdmin, logoutAdmin, getAdminProfile, updateAdminProfile } = require("../controllers/authadmin");

router.post("/admin/login", loginAdmin);
router.post("/admin/signup", signupAdmin);  
router.post("/admin/logout", logoutAdmin); 
router.get("/admin/profile", auth, roleCheck("admin"), getAdminProfile);  
router.put("/admin/profile", auth, roleCheck("admin"), updateAdminProfile); 


module.exports=router;

