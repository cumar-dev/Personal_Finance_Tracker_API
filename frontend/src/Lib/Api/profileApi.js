import axios from "./Axios";
import { useAuthStore } from "@/Lib/Store/AuthStore";

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const token = useAuthStore.getState().token;

  const { data } = await axios.put("/upload/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// Get profile
export const getProfile = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.get("/upload/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// Update name and email
export const updateProfileInfo = async (profile) => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.put("/upload/profile", profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  const token = useAuthStore.getState().token;

  const { data } = await axios.delete("/upload/profile-picture", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
