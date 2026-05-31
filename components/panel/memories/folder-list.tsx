"use client";

import { useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Folder } from "lucide-react";
import FolderCard from "./folder-card";
import FolderFormDialog from "./folder-form-dialog";
import type { FolderType } from "@/types/memoryType";
import { getMyFolders } from "@/actions/memory";

interface Props {
  initialFolders: FolderType[];
}

export default function FolderList({ initialFolders }: Props) {
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      const fresh = await getMyFolders();
      setFolders(fresh);
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {folders.length === 0 ? "هنوز آلبومی ندارید" : `${folders.length} آلبوم`}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="size-3.5" />
          آلبوم جدید
        </Button>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))
      ) : folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
            <Folder className="size-7" />
          </div>
          <p className="text-sm">آلبومی ندارید. بسازید تا خاطرات را مرتب کنید</p>
        </div>
      ) : (
        folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} onMutated={refresh} />
        ))
      )}

      <FolderFormDialog
        mode="create"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => refresh()}
      />
    </div>
  );
}
