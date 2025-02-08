const express=require("express");
const route=express.Router();

// const multer = require('multer');
// const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize:500000 } }); 

const {auth}=require("../middleware/Auth")
const {signup,login,verifyOtp,deleteUser,updateUser,logout}=require("../controllers/userController");
route.post("/signup",signup);
route.post("/login",login);
route.post("/verify-otp" ,verifyOtp);
route.delete("/delete/:id",auth,deleteUser);
route.patch("/update/:email",auth,updateUser);
route.get("/logout",auth,logout);
module.exports=route;