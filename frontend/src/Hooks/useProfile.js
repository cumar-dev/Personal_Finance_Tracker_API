import { uploadProfilePicture, updateProfileInfo } from "@/Lib/Api/profileApi";

import { useMutation } from "@tanstack/react-query";

export const useUploadProfilePicture = () => {
  return useMutation({
    mutationFn: uploadProfilePicture,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfileInfo,
  });
};
