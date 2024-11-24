const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
    teacherId: {
        type: String,
        function() {
        return this.isAdmin;
        },
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "admin",
    },
    profilePicture: {
        type: String,
    },
});
module.exports = mongoose.model("Admin", adminSchema);




