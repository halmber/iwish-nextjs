import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type ImageUploaderProps = {
  onCompressed: (file: File | null) => void;
  isCompressing: boolean;
  setIsCompressing: (isCompressing: boolean) => void;
};

export function ImageUploader({
  onCompressed,
  isCompressing,
  setIsCompressing,
}: ImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);

    setIsCompressing(true);

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 512,
        useWebWorker: true,
      });

      onCompressed(compressed);

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

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageName(null);
    setIsCompressing(false);
    onCompressed(null);
    inputRef.current!.value = "";
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      {previewImage ? (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <Image
              src={previewImage}
              width={96}
              height={96}
              alt="Preview"
              className="rounded-xl max-w-[200px] object-cover border"
            />
            <span>{imageName}</span>
            <Button type="button" variant="ghost" onClick={handleRemoveImage}>
              <X />
            </Button>
          </div>
          <Separator />
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent hover:border-muted-foreground"
        >
          <span className="text-sm text-gray-500">Upload Image</span>
        </label>
      )}
      {isCompressing && (
        <span className="text-sm w-full text-muted-foreground">
          Compressing...
        </span>
      )}
      <input
        id="image-upload"
        type="file"
        ref={inputRef}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleImageChange}
        disabled={isCompressing}
        className="sr-only"
      />
    </div>
  );
}
