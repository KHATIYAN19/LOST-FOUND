const Found = require("../models/FoundModel");
const User = require("../models/userModel");
const Claim=require("../models/foundClaim");
exports.create=async(req,res)=>{
     try{
        const found_id=req.params.id;
        const { description } = req.body;
        const user_id = req.user._id;
   if(!description||!found_id){
    return res.status(400).json({
        message:"Description and found_id required",
        success:false
    })
   }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const found = await Found.findById(found_id);
    if (!found) {
      return res.status(404).json({
        message: "Found item not found",
        success: false,
      });
    }
    found.claim.push(user_id);
    await found.save();
    const claim = new Claim({
      description,
      user: user_id,
      found: found_id,
    });
    await claim.save();
    return res.status(201).json({
      message: "Claim created successfully",
      success: true,
      data: claim,
    });
     }catch(e){
        return res.status(400).json({
            message:"Something went wrong",
            success:false,
            error:e
        })
     }
}
exports.deleteClaim = async (req, res) => {
    try {
      const found_id=req.params.found_id;
      const claim_id=req.params.claim_id;
      const user_id = req.user._id;
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
      const found = await Found.findById(found_id);
      if (!found) {
        return res.status(404).json({
          message: "Found item not found",
          success: false,
        });
      }
      const claim = await Claim.findById(claim_id);
      if (!claim) {
        return res.status(404).json({
          message: "Claim not found",
          success: false,
        });
      }
      if (!claim.user.equals(user_id)) {
        return res.status(403).json({
          message: "You are not authorized to delete this claim",
          success: false,
        });
      }
      if (found.claim && Array.isArray(found.claim)) {
        found.claim = found.claim.filter(id => !id.equals(claim_id));
        await found.save();
      }
      await Claim.findByIdAndDelete(claim_id);
      return res.status(200).json({
        message: "Claim deleted successfully",
        success: true,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Something went wrong",
        success: false,
        error: e.message,
      });
    }
  };
  exports.update = async (req, res) => {
    try {
      const { description } = req.body;
      const { found_id, claim_id } = req.params;
      const user_id = req.user._id;
      if (!description || description.trim() === "") {
        return res.status(400).json({
          message: "Description is required",
          success: false,
        });
      }
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
      const found = await Found.findById(found_id);
      if (!found) {
        return res.status(404).json({
          message: "Found item not found",
          success: false,
        });
      }
      const claim = await Claim.findById(claim_id);
      if (!claim) {
        return res.status(404).json({
          message: "Claim not found",
          success: false,
        });
      }
      if (!claim.user.equals(user_id)) {
        return res.status(403).json({
          message: "You are not authorized to update this claim",
          success: false,
        });
      }
      claim.description = description;
      await claim.save();
      return res.status(200).json({
        message: "Claim updated successfully",
        success: true,
        data: claim,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Something went wrong",
        success: false,
        error: e.message,
      });
    }
  };
  exports.findClaimsByUser = async (req, res) => {
    try {
      const user_id = req.user._id;
      const claims = await Claim.find({ user: user_id });
      if (!claims || claims.length === 0) {
        return res.status(404).json({
          message: "No claims found for this user",
          success: false,
        });
      }
      return res.status(200).json({
        message: "Claims retrieved successfully",
        success: true,
        data: claims,
      });
    } catch (e) {
      return res.status(400).json({
        message: "Something went wrong",
        success: false,
        error: e.message,
      });
    }
  };
  