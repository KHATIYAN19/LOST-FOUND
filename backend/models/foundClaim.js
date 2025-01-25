const mongoose=require("mongoose");
const foundClaimSchema=new mongoose.Schema({  
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
      },
      found:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Found',
        required:true
      },
      description:{
        type:String,
        required:true
      },
      status:{
        type:String,
        enum:['accept','reject','pending'],
        default:'pending'
      }
},{timeStams:true});
module.exports=mongoose.model("FoundClaim",foundClaimSchema);