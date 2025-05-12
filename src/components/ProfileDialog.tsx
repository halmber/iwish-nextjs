"use client";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User, Camera, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  profileFormSchema,
  ProfileFormSchemaType,
} from "../app/(dashboard)/schemas";
import { updateProfile } from "../app/(dashboard)/actions";
import { fileUploadService } from "@/lib/fileUploadService";
import { User as UserType } from "next-auth";

export function ProfileDialog({
  onClose,
  open,
  user,
}: {
  onClose: () => void;
  open: boolean;
  user: UserType | null;
}) {
  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name!,
      email: user?.email!,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
      });
    }
  }, [user, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });
      setCompressedFile(compressed);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      console.error("Compression failed", err);
      toast({
        title: "Image compression failed",
        description: "Please try a different image.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const onSubmit = async (data: ProfileFormSchemaType) => {
    setIsSubmitting(true);

    try {
      const imgPath = await fileUploadService.uploadAvatar(
        compressedFile!,
        user?.id!,
      );

      const result = await updateProfile({ ...data, avatar: imgPath });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.success) {
        // Update the session to reflect the changes
        update({ ...data, image: imgPath });

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative h-24 w-24 rounded-full border border-border">
                {previewImage ? (
                  <Image
                    src={previewImage || ""}
                    alt="Profile preview"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : user?.image ? (
                  <Image
                    src={user.image || ""}
                    alt="Profile picture"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {isCompressing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer"
                >
                  <Camera className="h-5 w-5 text-primary-foreground" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Click the camera icon to change your photo
              </p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormDescription>
                    This is the email associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || isCompressing}>
                {isSubmitting || isCompressing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
