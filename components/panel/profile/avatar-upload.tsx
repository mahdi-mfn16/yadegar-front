"use client";

import { useState, useCallback, useRef, useTransition } from "react";
import Cropper from "react-easy-crop";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProfile } from "@/actions/user";
import { User, Camera } from "lucide-react";
import type { UserType } from "@/types/userType";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function getCroppedBlob(imageSrc: string, pixelCrop: CropArea): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const OUTPUT_SIZE = 512;
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas empty"))),
      "image/jpeg",
      0.85
    );
  });
}

interface Props {
  user: UserType;
}

export default function AvatarUpload({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setIsOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const onCropComplete = useCallback((_: CropArea, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleConfirm() {
    if (!rawImageSrc || !croppedAreaPixels) return;
    startTransition(async () => {
      try {
        const blob = await getCroppedBlob(rawImageSrc, croppedAreaPixels);
        const formData = new FormData();
        formData.append("avatar", new File([blob], "avatar.jpg", { type: "image/jpeg" }));

        const result = await updateProfile(user.id, formData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("تصویر پروفایل بروزرسانی شد");
        setIsOpen(false);
        setRawImageSrc(null);
      } catch {
        toast.error("خطا در پردازش تصویر");
      }
    });
  }

  return (
    <>
      <div
        className="relative cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="size-20 ring-4 ring-primary/20 transition-opacity group-hover:opacity-80">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm">
          <Camera className="size-3.5" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm gap-4">
          <DialogHeader>
            <DialogTitle className="mr-6">برش تصویر پروفایل</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-64 bg-muted rounded-xl overflow-hidden">
            {rawImageSrc && (
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center -mt-1">
            بکشید یا اسکرول کنید برای تنظیم
          </p>

          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              انصراف
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "در حال ذخیره..." : "تایید"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
