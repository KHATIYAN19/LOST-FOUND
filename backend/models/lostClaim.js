const mongoose=require("mongoose");
const lostClaimSchema=new mongoose.Schema({  
           user:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'User',
             required:true
           },
           lost:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'Lost',
             required:true
           },
           description:{
             type:String,
             required:true
           }
},{timeStams:true});
module.exports=mongoose.model("LostClaim",lostClaimSchema);