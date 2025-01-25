const express=require("express");
const cors = require("cors");
require('dotenv').config();
const app=express();
var cookieParser = require('cookie-parser');
const Dbconnect=require("./Utils/DbConnections");
const userRoutes=require("./routes/userRoute");
const foundRoutes=require("./routes/foundRoutes");
const lostRoutes=require("./routes/lostRoutes");
const foundRoutesClaims=require("./routes/foundClaimRoutes")
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));






app.use("/",userRoutes);
app.use("/found",foundRoutes);
app.use("/lost",lostRoutes);
app.use("/found/claim",foundRoutesClaims);
app.listen(process.env.PORT,()=>{
    console.log(`App is listening on ${process.env.PORT}`);
});
Dbconnect();

 
