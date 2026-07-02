"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2, Video, Mic, Folder } from "lucide-react";
import { deleteMemory } from "@/actions/memory";
import { toShamsi } from "@/components/ui/persian-date-picker";
import { VISIBILITY_BADGE, type MemoryType } from "@/types/memoryType";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  memory: MemoryType;
  onMutated: () => void;
}

type MediaModal = { type: "photo" | "audio" | "video"; url: string } | null;

export default function MemoryCard({ memory, onMutated }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mediaModal, setMediaModal] = useState<MediaModal>(null);

  const badge = VISIBILITY_BADGE[memory.visibility];
  const photoUrl = memory.photo?.file ?? null;
  const audioUrl = memory.audio?.file ?? null;
  const videoUrl = memory.video?.file ?? null;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMemory(memory.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("خاطره حذف شد");
      onMutated();
      setIsDeleteOpen(false);
    });
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="flex gap-3">

            {/* تصویر — سمت راست (اول در DOM = راست در RTL) */}
            {photoUrl && (
              <button
                onClick={() => setMediaModal({ type: "photo", url: photoUrl })}
                className="shrink-0 size-16 rounded-xl overflow-hidden border border-border/60 self-start"
              >
                {/* <img
                  src={photoUrl}
                  alt={memory.title ?? "عکس خاطره"}
                  className="w-full h-full object-cover"
                /> */}
                <div className="relative w-full h-full">
                  <Image
                    src={photoUrl}
                    alt={memory.title ?? "عکس خاطره"}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              </button>
            )}

            {/* محتوا */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">

              {/* ردیف اول: عنوان + بج + منو */}
              <div className="flex items-start justify-between gap-1">
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug line-clamp-1">
                    {memory.title || "بدون عنوان"}
                  </p>
                  <Badge className={cn("text-xs px-1.5 py-0 h-4 shrink-0", badge.className)}>
                    {badge.label}
                  </Badge>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 shrink-0 -mt-0.5 -ml-1">
                      <MoreVertical className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/panel/memories/${memory.id}/edit`)}>
                      <Pencil className="size-4 ml-2" />
                      ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <Trash2 className="size-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* متن پیش‌نمایش */}
              {memory.text && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {memory.text}
                </p>
              )}

              {/* فوتر */}
              <div className="flex items-center gap-2 flex-wrap">
                {memory.date && (
                  <span className="text-xs text-muted-foreground">
                    {toShamsi(memory.date)}
                  </span>
                )}
                {memory.folder && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Folder className="size-3" />
                    {memory.folder.title}
                  </span>
                )}
                <div className="flex items-center gap-2 mr-auto">
                  {videoUrl && (
                    <button onClick={() => setMediaModal({ type: "video", url: videoUrl })} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Video className="size-3.5" />
                    </button>
                  )}
                  {audioUrl && (
                    <button onClick={() => setMediaModal({ type: "audio", url: audioUrl })} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Mic className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* مودال رسانه */}
      <Dialog open={!!mediaModal} onOpenChange={() => setMediaModal(null)}>
        <DialogContent className="max-w-sm gap-3" showCloseButton>
          <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
          {mediaModal?.type === "photo" && (
            // <img
            //   src={mediaModal.url}
            //   alt="تصویر خاطره"
            //   className="w-full rounded-lg object-contain max-h-[70vh]"
            // />
            <div className="relative w-full h-[70vh]">
              <Image
                src={mediaModal.url}
                alt="تصویر خاطره"
                fill
                sizes="100vw"
                className="object-contain rounded-lg"
              />
            </div>
          )}
          {mediaModal?.type === "video" && (
            <video
              controls
              autoPlay
              src={mediaModal.url}
              className="w-full rounded-lg max-h-[70vh]"
            />
          )}
          {mediaModal?.type === "audio" && (
            <div className="p-4">
              <audio controls autoPlay src={mediaModal.url} className="w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف خاطره</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید؟ این خاطره برای همیشه حذف می‌شود.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "در حال حذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
