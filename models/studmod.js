const mongoose=require("mongoose");

const noticeSchema=new mongoose.Schema({
    title:{ 
        type:String,
        required:true
    },
detail:{
    type:String,
required:true
},
createdAt:{
    type:Date,
    default:Date.now
},
year:{
    type:Number,
    required:true
},
branch:{
    type:String,
    required:true
},
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
},
}
);
module.exports = mongoose.model("Notice", noticeSchema);