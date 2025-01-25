const Found = require("../models/FoundModel");
const User = require("../models/userModel");



exports.create = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { description, location } = req.body;
        if (!description || !location) {
            return res.status(400).json({
                message: "All feild Required",
                success: false
            })
        }
        const user = await User.findOne({ id: user_id })
        if (!user) {
            return res.status(400).json({
                message: "No user found",
                success: false
            })
        }
        const found=await Found.create({
            description,
            location,
            postby:user._id
        })
         user.founds.push(found._id);
         await user.save();
        return res.status(200).json({
            message:"Post Uploaded",
            success:true
        })
    } catch (e) {
        return res.status(400).json({
            message: "Something Went Wrong",
            success: false,
            error: e.message
        })
    }
}

exports.update = async (req, res) => {
    try {
        const user_id = req.user._id;
        const found_id=req.params.id;
        const {  description, location } = req.body;

        if (!found_id || !description || !location) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const user = await User.findOne({ id: user_id });
        if (!user) {
            return res.status(400).json({
                message: "No user found",
                success: false,
            });
        }

        const found = await Found.findOne({ _id: found_id, postby: user._id });
        if (!found) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        found.description = description;
        found.location = location;
        await found.save();

        return res.status(200).json({
            message: "Post updated successfully",
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

exports.deletePost = async (req, res) => {
    try {
        const user_id = req.user._id;
        const  found_id  = req.params.id;
        if (!found_id) {
            return res.status(400).json({
                message: "Found ID is required",
                success: false,
            });
        }
        const user = await User.findOne({ id: user_id });
        if (!user) {
            return res.status(400).json({
                message: "No user found",
                success: false,
            });
        }
        const found = await Found.findOne({ _id: found_id, postby: user._id });
        if (!found) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        await Found.deleteOne({ _id: found_id });
        user.founds = user.founds.filter((id) => id.toString() !== found_id);
        await user.save();
        return res.status(200).json({
            message: "Post deleted successfully",
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


exports.getAllByUser = async (req, res) => {
    try {
        const user_id  = req.user._id;
        let filter = {};
        if (user_id) {
            filter.postby = user_id; 
        }
        const founds = await Found.find(filter)
            .populate('postby', 'name email') 
            .sort({ createdAt: -1 }); 
        if (founds.length === 0) {
            return res.status(404).json({
                message: "No posts found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Found posts retrieved successfully",
            success: true,
            data: founds,
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: e.message,
        });
    }
};

exports.getAll = async (req, res) => {
    try {
       
        const founds = await Found.find({}).sort({ createdAt: -1 });
        if (founds.length === 0) {
            return res.status(404).json({
                message: "No posts found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Found posts retrieved successfully",
            success: true,
            data: founds,
        });
    } catch (e) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: e.message,
        });
    }
};


exports.closePost = async (req, res) => {
    try {
        const user_id=req.user.id;
        const found_id=req.params.id;
        if (!user_id || !found_id) {
            return res.status(400).json({
                message: "User ID and Found ID are required",
                success: false,
            });
        }
        const found = await Found.findOne({ _id: found_id });
        if (!found) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }
        if (found.postby.toString() !== user_id) {
            return res.status(403).json({
                message: "You are not authorized to close this post",
                success: false,
            });
        }
        if(!found.isAvailable){
            return res.status(400).json({
                message: "Already Close",
                success: false,
            });
        }
        found.isAvailable = false;
        await found.save();
        return res.status(200).json({
            message: "Post closed successfully",
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
