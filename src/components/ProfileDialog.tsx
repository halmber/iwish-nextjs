"use client";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User, Camera } from "lucide-react";

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

export function ProfileDialog({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}) {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name!,
      email: session?.user?.email!,
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      });
    }
  }, [session, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormSchemaType) => {
    setIsSubmitting(true);

    try {
      const imgPath = await fileUploadService.uploadAvatar(
        fileInputRef.current?.files?.[0]!,
        session?.user?.id!,
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
                ) : session?.user?.image ? (
                  <Image
                    src={session.user.image || ""}
                    alt="Profile picture"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
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
                  accept="image/*"
                  ref={fileInputRef}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
