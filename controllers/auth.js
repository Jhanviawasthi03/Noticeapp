const bcrypt=require("bcrypt");
const User=require("../models/User.js");
const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.signup=async(req,res)=>{
    try{
  const{username,email,rollNumber,password,profilePicture}=req.body;
  
 const existinguser=await User.findOne({email});
  if(existinguser){
    return res.status(400).json({
        success:false,
        message:"user already exists",
    });
  }
  const existingRollNumber = await User.findOne({ rollNumber });
if (existingRollNumber) {
  return res.status(400).json({
    success: false,
    message: "Roll number already registered",
  });
}

  let hashedpassword;
  try{
    hashedpassword=await bcrypt.hash(password,10);
  }
  catch(err){
    return res.status(500).json({
        success:false,
        message:"error in hashing password",
    });
  }

  const user= await  User.create({
    username,rollNumber,email,password:hashedpassword,profilePicture,role:"user"
  });

  return res.status(200).json({
success:true,
message:"user created successfully",

  });
    }
    catch(error){
console.error(error);
return res.status(500).json({
    success:false,
    message:"user cannot be registered please try again later",
});
    }
};



exports.login = async (req, res) => {
    try {
        const { rollNumber, password } = req.body;
        
        
        if (!rollNumber || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        
        let user = await User.findOne({ rollNumber});
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered",
            });
        }

    
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                // email: user.email,
                rollNumber:user.rollNumber,
                role: user.role,
            };

            
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
             user=user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 
                httpOnly: true,
            };

            
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",
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





exports.logout = (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true });

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};



exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({rollNumber:req.user.rollNumber}).select("-password"); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve profile",
        });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const updatedData = req.body;
        const user = await User.findOneAndUpdate(
            {rollNumber:req.user.rollNumber},
             updatedData, 
             { new: true }
            ).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};