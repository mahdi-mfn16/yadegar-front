"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toShamsi } from "@/components/ui/persian-date-picker";
import { type MemoryType } from "@/types/memoryType";
import { UserCircle, EyeOff, Mic, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  memory: MemoryType;
}

type MediaModal = { type: "photo" | "audio" | "video"; url: string } | null;

const TEXT_CUTOFF = 130;

export default function ExploreMemoryCard({ memory }: Props) {
  const [mediaModal, setMediaModal] = useState<MediaModal>(null);
  const [showFullText, setShowFullText] = useState(false);

  const isAnonymous = memory.visibility === "anonymous";
  const photoUrl = memory.photo?.file ?? null;
  const audioUrl = memory.audio?.file ?? null;
  const videoUrl = memory.video?.file ?? null;
  const hasMedia = !!(audioUrl || videoUrl);

  const textIsLong = !!(memory.text && (memory.text.length > TEXT_CUTOFF || memory.text.includes("\n")));
  const authorName = isAnonymous ? "ناشناس" : (memory.user?.name || "کاربر");

  const AuthorRow = () => (
    <div className="flex items-center gap-2">
      {isAnonymous ? (
        <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
          <EyeOff className="size-3.5 text-muted-foreground" />
        </div>
      ) : (
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={memory.user?.avatar || undefined} alt={authorName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <UserCircle className="size-3.5" />
          </AvatarFallback>
        </Avatar>
      )}

      <span className="flex-1 min-w-0 text-xs font-medium text-foreground/80 truncate">
        {authorName}
      </span>

      {memory.date && (
        <span className="text-[11px] text-muted-foreground shrink-0 font-light">
          {toShamsi(memory.date)}
        </span>
      )}
    </div>
  );

  return (
    <>
      <article className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-sm transition-shadow duration-200">

        {/* ─── محتوا ─── */}
        <div className={cn("flex flex-col gap-2.5 px-3.5 pb-3.5", photoUrl ? "pt-3.5" : "pt-3.5")}>

          {/* نویسنده + تاریخ — همیشه بالا */}
          <AuthorRow />

          {/* عکس کاور — بعد از نویسنده */}
          {photoUrl && (
            <button
              className="block w-full overflow-hidden rounded-sm focus-visible:outline-none -mx-0"
              onClick={() => setMediaModal({ type: "photo", url: photoUrl })}
              aria-label="مشاهده تصویر"
            >
              {/* <img
                src={photoUrl}
                alt={memory.title ?? "خاطره"}
                className="w-full h-52 object-cover rounded-sm hover:brightness-95 transition-[filter] duration-200"
              /> */}
              <div className="relative w-full h-52 overflow-hidden rounded-sm">
                <Image
                  src={photoUrl}
                  alt={memory.title ?? "خاطره"}
                  fill
                  className="object-cover hover:brightness-95 transition-[filter] duration-200"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            </button>
          )}

          {/* عنوان */}
          {memory.title && (
            <h3 className="font-bold text-sm leading-snug text-foreground">
              {memory.title}
            </h3>
          )}

          {/* متن */}
          {memory.text && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                {memory.text}
              </p>
              {textIsLong && (
                <button
                  onClick={() => setShowFullText(true)}
                  className="self-start text-xs text-primary hover:text-primary/75 transition-colors"
                >
                  بیشتر بخوان
                </button>
              )}
            </div>
          )}

          {/* رسانه */}
          {hasMedia && (
            <div className="flex items-center gap-2 pt-0.5">
              {audioUrl && (
                <button
                  onClick={() => setMediaModal({ type: "audio", url: audioUrl })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors text-xs text-foreground"
                >
                  <Mic className="size-3 text-primary" />
                  <span>پخش صدا</span>
                </button>
              )}
              {videoUrl && (
                <button
                  onClick={() => setMediaModal({ type: "video", url: videoUrl })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors text-xs text-foreground"
                >
                  <Play className="size-3 text-primary" />
                  <span>پخش ویدیو</span>
                </button>
              )}
            </div>
          )}
        </div>
      </article>

      {/* ─── مودال متن کامل ─── */}
      <Dialog open={showFullText} onOpenChange={setShowFullText}>
        <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
          <DialogHeader><DialogTitle /></DialogHeader>
          <div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden max-h-[80vh] p-5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-border">
              <AuthorRow />
            </div>

            {memory.title && (
              <h3 className="font-bold text-base leading-snug">{memory.title}</h3>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
              {memory.text}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── مودال رسانه ─── */}
      <Dialog open={!!mediaModal} onOpenChange={() => setMediaModal(null)}>
        <DialogContent
          className={cn(
            "max-w-sm",
            mediaModal?.type === "photo" ? "p-0 overflow-hidden gap-0" : "gap-3 pt-10"
          )}
          showCloseButton={false}
        >
          <DialogHeader><DialogTitle /></DialogHeader>
          <button
            onClick={() => setMediaModal(null)}
            aria-label="بستن"
            className="absolute top-3 right-3 z-10 size-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="size-4" />
          </button>

          {mediaModal?.type === "photo" && (
            // <img
            //   src={mediaModal.url}
            //   alt="تصویر خاطره"
            //   className="w-full rounded-xl object-contain max-h-[75vh]"
            // />
            <div className="relative w-full h-[75vh]">
              <Image
                src={mediaModal.url}
                alt="تصویر خاطره"
                fill
                className="object-contain rounded-xl"
                sizes="100vw"
              />
            </div>
          )}
          {mediaModal?.type === "video" && (
            <video
              controls
              autoPlay
              src={mediaModal.url}
              className="w-full rounded-lg max-h-[65vh]"
            />
          )}
          {mediaModal?.type === "audio" && (
            <div className="px-1 pb-2">
              <audio controls autoPlay src={mediaModal.url} className="w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
