const mongoose=require("mongoose");
const foundSchema=new mongoose.Schema({  
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    postby:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    claim:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'FoundClaim'
          }
    ]
},{timeStams:true});
module.exports=mongoose.model("Found",foundSchema);