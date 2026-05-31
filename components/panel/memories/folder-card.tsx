"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import { Folder, MoreVertical, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { deleteFolder } from "@/actions/memory";
import type { FolderType } from "@/types/memoryType";
import FolderFormDialog from "./folder-form-dialog";

interface Props {
  folder: FolderType;
  onMutated: () => void;
}

export default function FolderCard({ folder, onMutated }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteFolder(folder.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("فولدر حذف شد");
      onMutated();
      setIsDeleteOpen(false);
    });
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
        onClick={() => router.push(`/panel/folders/${folder.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Folder className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base leading-tight truncate">
                  {folder.title}
                </p>
                {folder.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                    {folder.description}
                  </p>
                )}
                {folder.memories && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {folder.memories.length} خاطره
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditOpen(true);
                    }}
                  >
                    <Pencil className="size-4 ml-2" />
                    ویرایش
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="size-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChevronLeft className="size-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <FolderFormDialog
        mode="edit"
        folder={folder}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onMutated}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف فولدر</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید فولدر «{folder.title}» را حذف کنید؟
              این عمل قابل بازگشت نیست.
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
