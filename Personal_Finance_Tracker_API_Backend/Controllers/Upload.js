import cloudinary from "../Utils/Cloudinary.js";
import User from "../Model/User.js";

export const uploadFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded yet.",
    });
  }

  const stream = cloudinary.uploader.unsigned_upload_stream(
    process.env.CLOUDINARY_UPLOAD_PRESET,
    {
      folder: "personal_profile_picture",
      resource_type: "auto",
    },
    async (error, result) => {
      try {
        if (error) return next(error);

        // UPDATE USER PROFILE IMAGE
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { profile: result.secure_url },
          { new: true }
        ).select("-password");

        return res.status(201).json({
          success: true,
          message: "Profile updated successfully",
          user: updatedUser,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  stream.end(req.file.buffer);
};