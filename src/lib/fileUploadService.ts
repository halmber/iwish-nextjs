import { BUCKETS } from "./constants";
import { createClient, getPublicAvatarUrl } from "./supabase/client";

class FileUploadServiceImpl {
  private uploadFn: (file: File, userId: string) => Promise<string>;

  constructor() {
    const isDev = process.env.NODE_ENV === "development";
    this.uploadFn = isDev ? this.uploadLocal : this.uploadToSupabase;
  }

  async uploadAvatar(file: File, userId: string): Promise<string> {
    return await this.uploadFn(file, userId);
  }

  private async uploadLocal(file: File, userId: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const res = await fetch("/api/upload-avatar-local", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to upload locally");

    return data.path; // e.g., "/avatars/<userId>/filename.jpg"
  }

  private getStorage() {
    const { storage } = createClient();
    return storage;
  }

  // Uploads a file to Supabase storage if in production
  // and returns the public URL of the uploaded file
  private async uploadToSupabase(file: File, userId: string): Promise<string> {
    const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
    const options = {
      cacheControl: "3600",
      maxWidthOrHeight: 512,
      upsert: true,
    };

    const { data, error } = await this.getStorage()
      .from(BUCKETS.AVATARS)
      .upload(path, file, options);

    if (error) throw error;

    return getPublicAvatarUrl(data.path);
  }
}

export const fileUploadService = new FileUploadServiceImpl();
