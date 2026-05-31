"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ImagePlus, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  type: "photo" | "video";
  value: File | null | "remove";
  existingUrl?: string | null;
  onChange: (file: File | null | "remove") => void;
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

export default function MediaUpload({ type, value, existingUrl, onChange }: MediaUploadProps) {
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

  // حالت: فایل جدید انتخاب شده
  if (value instanceof File) {
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
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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

  // حالت: فایل موجود از سرور (حالت ادیت، هنوز پاک نشده)
  if (value === null && existingUrl) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30">
        {type === "photo" ? (
          <img
            src={existingUrl}
            alt="تصویر فعلی"
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="flex items-center gap-3 p-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <VideoIcon className="size-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">ویدیو فعلی</p>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="size-7 rounded-full opacity-90"
            onClick={() => inputRef.current?.click()}
            title="جایگزینی"
          >
            <ImagePlus className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="size-7 rounded-full opacity-90"
            onClick={() => onChange("remove")}
            title="حذف"
          >
            <X className="size-3.5" />
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={cfg.accept}
          className="hidden"
          onChange={handleFile}
        />
      </div>
    );
  }

  // حالت: پاک شده توسط کاربر
  if (value === "remove") {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-destructive/40 bg-destructive/5">
        <p className="text-sm text-muted-foreground flex-1">حذف خواهد شد</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={() => onChange(null)}
        >
          بازگشت
        </Button>
      </div>
    );
  }

  // حالت: آماده آپلود (بدون فایل)
  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 w-full py-5 rounded-xl",
          "border-2 border-dashed border-border hover:border-primary",
          "hover:bg-primary/5 transition-colors text-center"
        )}
      >
        <div className="size-9 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="size-4 text-muted-foreground" />
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
