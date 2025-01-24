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
    close:{
        type:boolean,
        default:false
    },
    claim:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'FoundClaim'
          }
    ]
},{timeStams:true});
module.exports=mongoose.model("Found",foundSchema);