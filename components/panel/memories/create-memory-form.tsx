"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PersianDatePicker from "@/components/ui/persian-date-picker";
import AudioRecorder from "./audio-recorder";
import MediaUpload from "./media-upload";
import FolderFormDialog from "./folder-form-dialog";
import { createMemory, updateMemory, getMyFolders } from "@/actions/memory";
import { VISIBILITY_OPTIONS, MEMORY_FORM_INITIAL } from "@/types/memoryType";
import type { MemoryFormState, MemoryType, FolderType } from "@/types/memoryType";
import { ChevronRight, ChevronLeft, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  mode?: "create" | "edit";
  initialMemory?: MemoryType;
  initialFolderId?: number | null;
}

const STEPS = ["محتوا", "رسانه", "تنظیمات"];

export default function CreateMemoryForm({ mode = "create", initialMemory, initialFolderId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);

  const [formState, setFormState] = useState<MemoryFormState>(() => {
    if (initialMemory) {
      return {
        title: initialMemory.title ?? "",
        text: initialMemory.text ?? "",
        folder_id: initialMemory.folder_id ?? initialMemory.folder?.id ?? null,
        photo: null,
        video: null,
        audioBlob: null,
        date: initialMemory.date ?? "",
        visibility: initialMemory.visibility,
      };
    }
    return { ...MEMORY_FORM_INITIAL, folder_id: initialFolderId ?? null };
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getMyFolders().then(setFolders);
  }, []);

  function update<K extends keyof MemoryFormState>(key: K, value: MemoryFormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
  }

  function handleSubmit() {
    if (!formState.visibility) {
      toast.error("نوع دسترسی الزامی است");
      return;
    }

    const { photo, video, audioBlob } = formState;

    startTransition(async () => {
      const fd = new FormData();
      fd.append("visibility", formState.visibility);
      if (formState.title) fd.append("title", formState.title);
      if (formState.text) fd.append("text", formState.text);
      if (formState.folder_id) fd.append("folder_id", String(formState.folder_id));
      if (formState.date && /^\d{4}-\d{2}-\d{2}$/.test(formState.date)) fd.append("date", formState.date);

      if (photo instanceof File) {
        fd.append("photo", photo);
      } else if (photo === "remove") {
        fd.append("remove_photo", "1");
      }

      if (video instanceof File) {
        fd.append("video", video);
      } else if (video === "remove") {
        fd.append("remove_video", "1");
      }

      if (audioBlob instanceof Blob) {
        const ext = audioBlob.type.includes("ogg") ? ".ogg" : ".webm";
        fd.append("audio", new File([audioBlob], `recording${ext}`, { type: audioBlob.type }));
      } else if (audioBlob === "remove") {
        fd.append("remove_audio", "1");
      }

      const result = mode === "edit" && initialMemory
        ? await updateMemory(initialMemory.id, fd)
        : await createMemory(fd);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "خاطره ثبت شد" : "خاطره ویرایش شد");
      router.push("/panel/dashboard");
    });
  }

  const existingPhoto = initialMemory?.photo?.file ?? null;
  const existingVideo = initialMemory?.video?.file ?? null;
  const existingAudio = initialMemory?.audio?.file ?? null;

  return (
    <div className="flex flex-col gap-5">
      {/* نوار مراحل */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-1">
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0",
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
            <span className={cn(
              "text-xs hidden sm:inline transition-colors",
              i === step ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1 rounded-full transition-colors", i < step ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      {/* اسلایدر مراحل */}
      <div className="overflow-hidden" dir="ltr">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${step * -100}%)` }}
        >
          {/* ─── مرحله ۱: محتوا ─── */}
          <div dir="rtl" className="w-full flex-none flex flex-col gap-4 px-0.5">
            {/* ناحیه نوشتاری — مثل نوت‌بوک */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <input
                className="w-full px-4 pt-4 pb-2 text-lg font-semibold bg-transparent outline-none placeholder:text-muted-foreground/50"
                placeholder="عنوان خاطره..."
                value={formState.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <div className="mx-4 border-t border-dashed border-border/60" />
              <textarea
                ref={textareaRef}
                className="w-full px-4 pt-3 pb-4 text-base leading-7 bg-transparent outline-none resize-none placeholder:text-muted-foreground/50 min-h-[140px]"
                placeholder="خاطره‌ات را اینجا بنویس..."
                value={formState.text}
                onChange={(e) => { update("text", e.target.value); autoResize(); }}
                rows={5}
              />
            </div>

            {/* انتخاب آلبوم */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-muted-foreground px-1">آلبوم (اختیاری)</Label>
              <div className="flex gap-2">
                <Select
                  value={formState.folder_id ? String(formState.folder_id) : "none"}
                  onValueChange={(val) => update("folder_id", val === "none" ? null : Number(val))}
                >
                  <SelectTrigger className="flex-1" style={{ height: '44px' }}>
                    <SelectValue placeholder="بدون آلبوم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون آلبوم</SelectItem>
                    {folders.map((f) => (
                      <SelectItem key={f.id} value={String(f.id)}>{f.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => setIsFolderDialogOpen(true)}
                  style={{ height: '44px' }}
                  className="px-3 shrink-0 flex items-center gap-1.5 text-sm border border-input rounded-lg bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <FolderPlus className="size-4" />
                  <span className="hidden sm:inline">آلبوم جدید</span>
                </button>
              </div>
            </div>
          </div>

          {/* ─── مرحله ۲: رسانه ─── */}
          <div dir="rtl" className="w-full flex-none flex flex-col gap-4 px-0.5">
            <p className="text-sm text-muted-foreground">افزودن رسانه اختیاری است</p>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-muted-foreground px-1">عکس</Label>
              <MediaUpload
                type="photo"
                value={formState.photo}
                existingUrl={existingPhoto}
                onChange={(f) => update("photo", f)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-muted-foreground px-1">ویدیو</Label>
              <MediaUpload
                type="video"
                value={formState.video}
                existingUrl={existingVideo}
                onChange={(f) => update("video", f)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-muted-foreground px-1">صدا</Label>
              <AudioRecorder
                value={formState.audioBlob}
                existingUrl={existingAudio}
                onChange={(b) => update("audioBlob", b)}
              />
            </div>
          </div>

          {/* ─── مرحله ۳: تنظیمات ─── */}
          <div dir="rtl" className="w-full flex-none flex flex-col gap-4 px-0.5">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-muted-foreground px-1">تاریخ خاطره (اختیاری)</Label>
              <PersianDatePicker
                value={formState.date}
                onChange={(d) => update("date", d ?? "")}
                placeholder="انتخاب تاریخ شمسی"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-muted-foreground px-1">
                نوع دسترسی <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formState.visibility}
                onValueChange={(val) => update("visibility", val as MemoryFormState["visibility"])}
              >
                <SelectTrigger className="w-full" style={{ height: '44px' }}>
                  <SelectValue placeholder="انتخاب کنید..." />
                </SelectTrigger >
                <SelectContent className="w-full">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه‌های ناوبری */}
      <div className="flex gap-2 pt-2 border-t">
        {step > 0 && (
          <Button type="button" variant="outline" className="flex-1 gap-1.5 h-11" onClick={() => setStep((s) => s - 1)} disabled={isPending}>
            <ChevronRight className="size-4" />
            قبلی
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="button" className="flex-1 gap-1.5 h-11" onClick={() => setStep((s) => s + 1)}>
            بعدی
            <ChevronLeft className="size-4" />
          </Button>
        ) : (
          <Button type="button" className="flex-1 h-11" onClick={handleSubmit} disabled={isPending || !formState.visibility}>
            {isPending ? "در حال ذخیره..." : mode === "create" ? "ثبت خاطره" : "ذخیره تغییرات"}
          </Button>
        )}
      </div>

      <FolderFormDialog
        mode="create"
        open={isFolderDialogOpen}
        onOpenChange={setIsFolderDialogOpen}
        onSuccess={(folder) => {
          if (folder) {
            setFolders((prev) => [...prev, folder]);
            update("folder_id", folder.id);
          }
        }}
      />
    </div>
  );
}
