"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function CreateMemoryForm({
  mode = "create",
  initialMemory,
  initialFolderId,
}: Props) {
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
        folder_id: initialMemory.folder?.id ?? null,
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
    el.style.height = `${el.scrollHeight}px`;
  }

  function canGoNext(): boolean {
    if (step === 2 && !formState.visibility) return false;
    return true;
  }

  function handleSubmit() {
    if (!formState.visibility) {
      toast.error("نوع دسترسی الزامی است");
      return;
    }

    startTransition(async () => {
      const fd = new FormData();
      fd.append("visibility", formState.visibility);
      if (formState.title) fd.append("title", formState.title);
      if (formState.text) fd.append("text", formState.text);
      if (formState.folder_id) fd.append("folder_id", String(formState.folder_id));
      if (formState.date) fd.append("date", formState.date);
      if (formState.photo) fd.append("photo", formState.photo);
      if (formState.video) fd.append("video", formState.video);
      if (formState.audioBlob) {
        const ext = formState.audioBlob.type.includes("ogg") ? ".ogg" : ".webm";
        fd.append("audio", new File([formState.audioBlob], `recording${ext}`, { type: formState.audioBlob.type }));
      }

      const result =
        mode === "edit" && initialMemory
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

  return (
    <div className="flex flex-col gap-4">
      {/* نوار مراحل */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-sm font-semibold transition-colors flex-shrink-0",
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </div>
            <span className={cn("text-xs hidden sm:inline", i === step ? "text-foreground font-medium" : "text-muted-foreground")}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      {/* اسلایدر مراحل */}
      <div className="overflow-hidden rounded-xl" dir="ltr">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${step * -100}%)` }}
        >
          {/* ─── مرحله ۱: محتوا ─── */}
          <div dir="rtl" className="w-full flex-none flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Input
                className="h-11 text-base font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-ring"
                placeholder="عنوان خاطره (اختیاری)"
                value={formState.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <textarea
                ref={textareaRef}
                className="w-full resize-none bg-transparent outline-none text-base leading-relaxed placeholder:text-muted-foreground min-h-[120px]"
                placeholder="خاطره‌ات را بنویس..."
                value={formState.text}
                onChange={(e) => {
                  update("text", e.target.value);
                  autoResize();
                }}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              <Label className="text-sm font-medium">فولدر (اختیاری)</Label>
              <div className="flex gap-2">
                <Select
                  value={formState.folder_id ? String(formState.folder_id) : "none"}
                  onValueChange={(val) =>
                    update("folder_id", val === "none" ? null : Number(val))
                  }
                >
                  <SelectTrigger className="h-11 flex-1">
                    <SelectValue placeholder="انتخاب فولدر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون فولدر</SelectItem>
                    {folders.map((f) => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 flex-shrink-0"
                  onClick={() => setIsFolderDialogOpen(true)}
                  title="فولدر جدید"
                >
                  <FolderPlus className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ─── مرحله ۲: رسانه ─── */}
          <div dir="rtl" className="w-full flex-none flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              افزودن رسانه اختیاری است
            </p>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">عکس</Label>
              <MediaUpload
                type="photo"
                value={formState.photo}
                onChange={(f) => update("photo", f)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">ویدیو</Label>
              <MediaUpload
                type="video"
                value={formState.video}
                onChange={(f) => update("video", f)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">صدا</Label>
              <AudioRecorder
                value={formState.audioBlob}
                onChange={(b) => update("audioBlob", b)}
              />
            </div>
          </div>

          {/* ─── مرحله ۳: تنظیمات ─── */}
          <div dir="rtl" className="w-full flex-none flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">تاریخ خاطره (اختیاری)</Label>
              <PersianDatePicker
                value={formState.date}
                onChange={(d) => update("date", d ?? "")}
                placeholder="انتخاب تاریخ شمسی"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                نوع دسترسی <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formState.visibility}
                onValueChange={(val) => update("visibility", val as MemoryFormState["visibility"])}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="انتخاب کنید..." />
                </SelectTrigger>
                <SelectContent>
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
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-1.5"
            onClick={() => setStep((s) => s - 1)}
            disabled={isPending}
          >
            <ChevronRight className="size-4" />
            قبلی
          </Button>
        )}

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            className="flex-1 gap-1.5"
            onClick={() => canGoNext() && setStep((s) => s + 1)}
            disabled={!canGoNext()}
          >
            بعدی
            <ChevronLeft className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isPending || !formState.visibility}
          >
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
