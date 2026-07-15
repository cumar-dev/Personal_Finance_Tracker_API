import cloudinary from "../Utils/Cloudinary.js";
import User from "../Models/User.js";

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
          message: "Profile created successfully",
          user: updatedUser,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  stream.end(req.file.buffer);
};

export const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    // if (user.profile?.public_id) {
    //   await cloudinary.uploader.destroy(user.profile.public_id);
    // }

    const stream = cloudinary.uploader.unsigned_upload_stream(
      process.env.CLOUDINARY_UPLOAD_PRESET,
      {
        folder: "profile_Picture",
        resource_type: "auto",
      },
      async (error, result) => {
        try {
          if (error) return next(error);

          user.profile = {
            url: result.secure_url,
            public_id: result.public_id,
          };

          await user.save();

          return res.status(200).json({
            success: true,
            message: "Profile image updated successfully.",
            user,
          });
        } catch (err) {
          next(err);
        }
      },
    );

    stream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};
