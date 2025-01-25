const express=require("express");
const route=express.Router();
const {isAdmin,isNormal,auth}=require('../middleware/Auth')

const {create,update,deletePost,getAll,getAllByUser,closePost}=require("../controllers/foundController");
route.post("/create",auth,create);
route.patch("/update/:id",auth,update);
route.delete("/delete/:id" ,auth,deletePost);
route.get("/getAll",getAll);
route.get("/getAllUser",auth,getAllByUser);
route.patch("/close/:id",auth,closePost);

module.exports=route;