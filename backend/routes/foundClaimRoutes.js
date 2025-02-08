const express=require("express");
const route=express.Router();
const {isAdmin,isNormal,auth}=require('../middleware/Auth')


const {create,update,deleteClaim,findClaimsByUser,AcceptClaim,RejectClaim}=require("../controllers/foundClaimController");
route.post("/create/:id",auth,create);
route.patch("/update/:found_id/:claim_id",auth,update);
route.delete("/delete/:found_id/:claim_id",auth,deleteClaim);
route.get("/getAll",auth,findClaimsByUser);
route.get("/accept/:found_id/:claim_id",auth,AcceptClaim);
route.get("/reject/:found_id/:claim_id",auth,RejectClaim)
// route.get("/getAllUser",auth,getAllByUser);
// route.patch("/close/:id",auth,closePost);
module.exports=route;