"use client";

import { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass } from "lucide-react";
import ExploreMemoryCard from "./explore-memory-card";
import { getPublicMemories } from "@/actions/explore";
import type { MemoryType } from "@/types/memoryType";

interface Props {
  initialItems: MemoryType[];
  initialPage: number;
  initialLastPage: number;
}

export default function ExploreFeed({ initialItems, initialPage, initialLastPage }: Props) {
  const [items, setItems] = useState<MemoryType[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = page < lastPage;

  const loadMoreRef = useRef<() => void>(() => {});

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return;
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await getPublicMemories(nextPage);
      setItems((prev) => [...prev, ...result.items]);
      setPage(result.currentPage);
      setLastPage(result.lastPage);
    });
  }, [isPending, hasMore, page]);

  // always keep ref fresh
  useEffect(() => {
    loadMoreRef.current = loadMore;
  });

  // IntersectionObserver — setup once
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "400px" }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0 && !isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
          <Compass className="size-7" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-medium">خاطره‌ای برای نمایش نیست</p>
          <p className="text-sm">اولین خاطره عمومی را ثبت کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((memory) => (
        <ExploreMemoryCard key={memory.id} memory={memory} />
      ))}

      {/* sentinel برای infinite scroll */}
      <div ref={sentinelRef} className="h-1" />

      {/* loading skeleton */}
      {isPending && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-3 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* پایان لیست */}
      {!hasMore && !isPending && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-4">
          همه خاطرات نمایش داده شد
        </p>
      )}
    </div>
  );
}
