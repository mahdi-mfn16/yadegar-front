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
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2, Image, Video, Mic, Folder } from "lucide-react";
import { deleteMemory } from "@/actions/memory";
import { toShamsi } from "@/components/ui/persian-date-picker";
import { VISIBILITY_BADGE, type MemoryType } from "@/types/memoryType";
import { cn } from "@/lib/utils";

interface Props {
  memory: MemoryType;
  onMutated: () => void;
}

export default function MemoryCard({ memory, onMutated }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const badge = VISIBILITY_BADGE[memory.visibility];

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
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* عنوان + بج */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-base leading-tight truncate">
                  {memory.title || "بدون عنوان"}
                </p>
                <Badge className={cn("text-xs px-2 py-0.5 h-5", badge.className)}>
                  {badge.label}
                </Badge>
              </div>

              {/* متن پیش‌نمایش */}
              {memory.text && (
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {memory.text}
                </p>
              )}

              {/* فوتر */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
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
                <div className="flex items-center gap-1.5 mr-auto">
                  {memory.photo && <Image className="size-3.5 text-muted-foreground" />}
                  {memory.video && <Video className="size-3.5 text-muted-foreground" />}
                  {memory.audio && <Mic className="size-3.5 text-muted-foreground" />}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 flex-shrink-0">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/panel/memories/${memory.id}/edit`)}
                >
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
        </CardContent>
      </Card>

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
