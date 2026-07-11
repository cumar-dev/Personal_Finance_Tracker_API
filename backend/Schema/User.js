import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("email must be valid"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be at most 100 character"),
  role: z.string().min(1, "role must be user or admin"),
  profile: z.string().min(5, "profile is required"),
});
