const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },

        teacherId: { type: String ,
            function () {
             return this.isAdmin;
              },
        },
        isAdmin: { type: Boolean, default: false },

    role: {
        type: String,
        enum:['user','admin'],
        default: "user", 
    },
    profilePicture: {
        type: String,
    },
});

module.exports = mongoose.model("User", userSchema);