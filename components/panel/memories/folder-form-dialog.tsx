"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createFolder, updateFolder } from "@/actions/memory";
import { folderSchema, type FolderFormData, type FolderType } from "@/types/memoryType";

interface Props {
  mode: "create" | "edit";
  folder?: FolderType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (folder?: FolderType) => void;
}

export default function FolderFormDialog({
  mode,
  folder,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FolderFormData>({
    resolver: zodResolver(folderSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: folder?.title ?? "",
        description: folder?.description ?? "",
      });
    }
  }, [open, folder, form]);

  function onSubmit(data: FolderFormData) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createFolder(data)
          : await updateFolder(folder!.id, data);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(mode === "create" ? "آلبوم ایجاد شد" : "آلبوم ویرایش شد");
      onOpenChange(false);
      onSuccess("folder" in result ? result.folder : undefined);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "آلبوم جدید" : "ویرایش آلبوم"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="folder-title">نام آلبوم</Label>
            <Input
              id="folder-title"
              className="h-11"
              placeholder="مثال: سفرها"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="folder-desc">توضیحات (اختیاری)</Label>
            <Textarea
              id="folder-desc"
              className="resize-none"
              rows={3}
              placeholder="توضیح کوتاهی درباره این آلبوم..."
              {...form.register("description")}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              انصراف
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "در حال ذخیره..." : "ذخیره"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
