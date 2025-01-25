const mongoose=require("mongoose");
const lostSchema=new mongoose.Schema({  
    image:{
        type:String,
        required:true,
    },
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
    claims:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'LostClaim'
          }
    ]
    
},{timeStams:true});

module.exports=mongoose.model("Lost",lostSchema);