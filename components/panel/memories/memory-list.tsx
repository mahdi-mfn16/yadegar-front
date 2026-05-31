"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, BookOpen } from "lucide-react";
import MemoryCard from "./memory-card";
import type { MemoryType } from "@/types/memoryType";
import { getMyMemories } from "@/actions/memory";

interface Props {
  initialMemories: MemoryType[];
  folderId?: number;
}

export default function MemoryList({ initialMemories, folderId }: Props) {
  const router = useRouter();
  const [memories, setMemories] = useState<MemoryType[]>(initialMemories);
  const [isLoading, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      const fresh = await getMyMemories();
      const filtered = folderId
        ? fresh.filter((m) => m.folder_id === folderId || m.folder?.id === folderId)
        : fresh;
      setMemories(filtered);
    });
  }, [folderId]);

  const newHref = folderId
    ? `/panel/memories/new?folder_id=${folderId}`
    : `/panel/memories/new`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {memories.length === 0
            ? "هنوز خاطره‌ای ندارید"
            : `${memories.length} خاطره`}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8"
          onClick={() => router.push(newHref)}
        >
          <PlusCircle className="size-3.5" />
          خاطره جدید
        </Button>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))
      ) : memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen className="size-7" />
          </div>
          <p className="text-sm text-center">
            هنوز خاطره‌ای ندارید.
            <br />
            اولین خاطره خود را بنویسید.
          </p>
          <Button size="sm" onClick={() => router.push(newHref)} className="gap-1.5">
            <PlusCircle className="size-4" />
            ثبت خاطره
          </Button>
        </div>
      ) : (
        memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} onMutated={refresh} />
        ))
      )}
    </div>
  );
}
