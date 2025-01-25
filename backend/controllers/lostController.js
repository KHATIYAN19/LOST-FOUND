const Lost = require("../models/lostModel");
const User = require("../models/userModel");
const upload =require("../utils/cloudinary")
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
        if (!req.file) {
            return res.status(400).send({ message: 'Item image is required' });
        }
        const result = await upload.uploadFile(req.file.path);
        image=result.secure_url
        const lost=await Lost.create({
            description,
            location,
            postby:user._id,
            image
        })
         user.losts.push(lost._id);
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
        const lost_id=req.params.id;
        const {  description, location } = req.body;
        console.log(req.body,lost_id)
        if (!lost_id || !description || !location) {
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

        const lost = await Lost.findOne({ _id: lost_id, postby: user._id });
        if (!lost) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        lost.description = description;
        lost.location = location;
        await lost.save();

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
        const  lost_id  = req.params.id;
        if (!lost_id) {
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
        const lost = await Lost.findOne({ _id: lost_id, postby: user._id });
        if (!lost) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }

        await Lost.deleteOne({ _id: lost_id });
        user.losts = user.losts.filter((id) => id.toString() !== lost_id);
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
        const losts = await Lost.find(filter)
            .populate('postby', 'name email') 
            .sort({ createdAt: -1 }); 
        if (losts.length === 0) {
            return res.status(404).json({
                message: "No posts found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Found posts retrieved successfully",
            success: true,
            data: losts,
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
       
        const losts = await Lost.find({}).sort({ createdAt: -1 });
        if (losts.length === 0) {
            return res.status(404).json({
                message: "No posts found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Lost posts retrieved successfully",
            success: true,
            data: losts,
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
        const lost_id=req.params.id;
        if (!user_id || !lost_id) {
            return res.status(400).json({
                message: "User ID and Lost ID are required",
                success: false,
            });
        }
        const lost = await Lost.findOne({ _id: lost_id });
        if (!lost) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }
        if (lost.postby.toString() !== user_id) {
            return res.status(403).json({
                message: "You are not authorized to close this post",
                success: false,
            });
        }
        if(!lost.isAvailable){
            return res.status(400).json({
                message: "Already Close",
                success: false,
            });
        }
        lost.isAvailable = false;
        await lost.save();
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
