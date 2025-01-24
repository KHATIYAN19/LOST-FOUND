const express=require("express");
const route=express.Router();

// const multer = require('multer');
// const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize:500000 } }); 


const {signup,login,verifyOtp,deleteUser,updateUser}=require("../controllers/userController");
route.post("/signup",signup);
route.post("/login",login);
route.post("/verify-otp" ,verifyOtp);
route.delete("/delete/:id",deleteUser);
route.patch("/update/:email",updateUser);
route.get("/test",(req,res)=>{
    return res.status(200).json({
        messgae:"rfnvjknS"
    })
})
module.exports=route;