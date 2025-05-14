import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { DEFAULT_IMAGE_URL } from "@/lib/constants";

type ImageUploaderProps = {
  onCompressed: (compressedFile: File | null) => void;
  setIsCompressing: (isCompressing: boolean) => void;
  deleteImage: () => void;
  isCompressing: boolean;
  imageUrl: string;
};

export function ImageUploader({
  onCompressed,
  setIsCompressing,
  isCompressing,
  imageUrl,
  deleteImage,
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
    deleteImage();
    if (inputRef.current) inputRef.current.value = "";
  };

  const renderImageBlock = (src: string, showName = false) => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <Image
          src={src}
          width={96}
          height={96}
          alt="Image Preview"
          className="rounded-xl max-w-[200px] object-cover border"
        />
        {showName && <span>{imageName}</span>}
        <Button type="button" variant="ghost" onClick={handleRemoveImage}>
          <X />
        </Button>
      </div>
      <Separator />
    </div>
  );

  return (
    <div className="flex flex-col gap-2 items-start">
      {previewImage ? (
        renderImageBlock(previewImage, true)
      ) : imageUrl !== DEFAULT_IMAGE_URL ? (
        renderImageBlock(imageUrl)
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
