const express=require("express");
const route=express.Router();
const {isAdmin,isNormal,auth}=require('../middleware/Auth')


const {create,update,deleteClaim,findClaimsByUser}=require("../controllers/foundClaimController");
route.post("/create/:id",auth,create);
route.patch("/update/:found_id/:claim_id",auth,update);
route.delete("/delete/:found_id/:claim_id",auth,deleteClaim);
route.get("/getAll",findClaimsByUser);
// route.get("/getAllUser",auth,getAllByUser);
// route.patch("/close/:id",auth,closePost);
module.exports=route;