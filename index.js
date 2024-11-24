const express = require("express");

const connectwithdb = require("./config/database.js"); 
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 7000;


app.use(express.json());

const user=require("./routes/user");
const notices = require("./routes/studrout");
const admin=require("./routes/adminroutes");

app.use("/api/v1",user);
app.use("/api/v1/notices", notices);
app.use("/api/v1/admin", admin);

connectwithdb(); 

app.listen(PORT, () => {
    console.log(`App is started at port no ${PORT}`);
});

app.get("/", (req, res) => {
    res.send('<h1>This is my homepage</h1>');
})

