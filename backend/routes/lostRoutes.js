const express=require("express");
const route=express.Router();
const {isAdmin,isNormal,auth}=require('../middleware/Auth')
const multer = require('multer');
const upload = multer({ storage:multer.diskStorage({}),limits:{fileSize:500000 } }); 

const {create,update,deletePost,getAll,getAllByUser,closePost}=require("../controllers/lostController");
route.post("/create",auth,upload.single('image'),create);
route.patch("/update/:id",auth,update);
route.delete("/delete/:id" ,auth,deletePost);
route.get("/getAll",getAll);
route.get("/getAllUser",auth,getAllByUser);
route.patch("/close/:id",auth,closePost);

module.exports=route;