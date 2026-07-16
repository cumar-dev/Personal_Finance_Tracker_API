import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/Lib/utils";
import { useAuthStore } from "@/Lib/Store/AuthStore";
import { useUploadProfilePicture, useUpdateProfile } from "@/Hooks/useProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProfilePicture, getProfile } from "@/Lib/Api/profileApi";
import { toast } from "sonner";
const MAX_FILE_SIZE_MB = 10;

const ProfilePage = ()=> {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { user } = useAuthStore();
  const profile = data?.user;

  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.profile?.url || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  // Sync local form state once the profile query resolves
  useEffect(() => {
    if (data?.user) {
      setAvatarUrl(data.user.profile?.url || "");
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setRole(data.user.role || "user");
    }
  }, [data]);

  const { mutate: uploadPicture, isPending: isUploading } =
    useUploadProfilePicture();
  const { mutate: saveProfile, isPending: isSaving } = useUpdateProfile();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`the image must be same size or less then ${MAX_FILE_SIZE_MB}MB`);
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    uploadPicture(file, {
      onSuccess: (res) => {
        setAvatarUrl(res.user.profile.url);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
      onError: (error) => {
        console.error(error);
        setAvatarUrl(profile?.profile?.url || "");
      },
    });
  };

  const handlePickPhoto = () => fileInputRef.current?.click();

  const handleRemovePhoto = async () => {
    try {
      await deleteProfilePicture();
      setAvatarUrl("");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveProfile = () => {
    saveProfile(
      {
        name,
        email,
      },
      {
        onSuccess: (data) => {
          console.log("Profile updated:", data);

          queryClient.invalidateQueries({
            queryKey: ["profile"],
          });
        },

        onError: (error) => {
          console.log(error.response?.data);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6 text-center">
        <p className="text-sm text-destructive">
         An issue happened during production of a profile please try again...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* ---------------- Profile photo card ---------------- */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {name
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handlePickPhoto}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-white transition-transform hover:scale-105 disabled:opacity-60"
                aria-label="Beddel sawirka profile-ka"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" strokeWidth={2.5} />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-1 flex-col gap-3 min-w-[220px]">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Profile photo
                </h2>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or WebP &middot; max {MAX_FILE_SIZE_MB} MB
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 rounded-lg"
                  onClick={handlePickPhoto}
                  disabled={isUploading}
                >
                  <Camera className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Change photo"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemovePhoto}
                  disabled={!avatarUrl || isUploading}
                  className="gap-2 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Account details card ---------------- */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-foreground">
            Account details
          </h2>

          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="axmed@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                disabled
                readOnly
                className="h-12 rounded-xl bg-muted/60 text-muted-foreground capitalize disabled:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* ---------------- Save button ---------------- */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className={cn(
              "h-12 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25",
              "hover:bg-primary/90",
            )}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save profile"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;