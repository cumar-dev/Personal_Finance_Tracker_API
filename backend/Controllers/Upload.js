import cloudinary from "../Utils/Cloudinary.js";
import User from "../Models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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

        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            profile: {
              url: result.secure_url,
              public_id: result.public_id,
            },
          },
          { new: true },
        ).select("-password");

        return res.status(201).json({
          success: true,
          message: "Profile picture uploaded successfully",
          user: updatedUser,
        });
      } catch (err) {
        next(err);
      }
    },
  );

  stream.end(req.file.buffer);
};

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old image if exists
    if (user.profile?.public_id) {
      try {
        const destroyResult = await cloudinary.uploader.destroy(
          user.profile.public_id,
          {
            resource_type: "image",
          },
        );

        console.log("Destroy Result:", destroyResult);
      } catch (err) {
        console.log("Cloudinary destroy failed:", err);
      }
    }

    const stream = cloudinary.uploader.unsigned_upload_stream(
      process.env.CLOUDINARY_UPLOAD_PRESET,
      {
        folder: "profile_Picture",
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }

        user.profile = {
          url: result.secure_url,
          public_id: result.public_id,
        };

        await user.save();

        return res.status(200).json({
          success: true,
          message: "Profile image updated successfully",
          user,
        });
      },
    );

    stream.end(req.file.buffer);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.profile?.public_id) {
      try {
        const result = await cloudinary.uploader.destroy(
          user.profile.public_id,
          {
            resource_type: "image",
            invalidate: true,
          }
        );

        console.log("Destroy Result:", result);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    user.profile = {
      url: "",
      public_id: "",
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture deleted",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};