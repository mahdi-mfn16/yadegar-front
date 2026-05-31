"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ImagePlus, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  type: "photo" | "video";
  value: File | null;
  onChange: (file: File | null) => void;
}

const CONFIG = {
  photo: {
    label: "عکس",
    accept: "image/jpeg,image/jpg,image/png",
    icon: ImagePlus,
    hint: "JPG یا PNG — حداکثر ۱ مگابایت",
    maxMB: 1,
  },
  video: {
    label: "ویدیو",
    accept: "video/mp4,video/x-matroska,video/avi",
    icon: VideoIcon,
    hint: "MP4, MKV یا AVI — حداکثر ۳۲ مگابایت",
    maxMB: 32,
  },
};

export default function MediaUpload({ type, value, onChange }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > cfg.maxMB * 1024 * 1024) {
      alert(`حجم فایل نباید بیشتر از ${cfg.maxMB} مگابایت باشد`);
      return;
    }
    onChange(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > cfg.maxMB * 1024 * 1024) {
      alert(`حجم فایل نباید بیشتر از ${cfg.maxMB} مگابایت باشد`);
      return;
    }
    onChange(file);
  }

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30">
        {type === "photo" ? (
          <img
            src={URL.createObjectURL(value)}
            alt="پیش‌نمایش"
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="flex items-center gap-3 p-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <VideoIcon className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / (1024 * 1024)).toFixed(1)} مگابایت
              </p>
            </div>
          </div>
        )}
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute top-2 left-2 size-7 rounded-full opacity-90"
          onClick={() => onChange(null)}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 w-full py-6 rounded-xl",
          "border-2 border-dashed border-border hover:border-primary",
          "hover:bg-primary/5 transition-colors text-center"
        )}
      >
        <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">افزودن {cfg.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{cfg.hint}</p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={cfg.accept}
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
}
