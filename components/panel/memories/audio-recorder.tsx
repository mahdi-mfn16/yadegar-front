"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: Blob | null | "remove";
  existingUrl?: string | null;
  onChange: (blob: Blob | null | "remove") => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AudioRecorder({ value, existingUrl, onChange }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [newAudioUrl, setNewAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!(value instanceof Blob) && newAudioUrl) {
      URL.revokeObjectURL(newAudioUrl);
      setNewAudioUrl(null);
      setDuration(0);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (newAudioUrl) URL.revokeObjectURL(newAudioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "audio/webm;codecs=opus";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const type = mimeType.includes("ogg") ? "audio/ogg" : "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setNewAudioUrl(url);
        onChange(blob);
        setIsRecording(false);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert("دسترسی به میکروفون رد شد");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }

  function deleteAudio() {
    if (newAudioUrl) URL.revokeObjectURL(newAudioUrl);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setNewAudioUrl(null);
    setIsPlaying(false);
    setDuration(0);
    onChange(null);
  }

  function togglePlay(url: string) {
    if (!audioRef.current || audioRef.current.src !== url) {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  }

  function renderPlayer(url: string, onDelete: () => void, label?: string) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
        <Button type="button" size="icon" variant="secondary" className="size-9 rounded-full shrink-0" onClick={() => togglePlay(url)}>
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <div className="flex-1">
          {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
          <div className="h-1 bg-muted rounded-full"><div className="h-full w-1/3 bg-primary rounded-full" /></div>
        </div>
        {duration > 0 && <span className="text-xs text-muted-foreground tabular-nums shrink-0">{formatDuration(duration)}</span>}
        <Button type="button" size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive shrink-0" onClick={onDelete}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    );
  }

  // در حال ضبط
  if (isRecording) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-destructive/30 bg-destructive/5">
        <span className="size-2.5 rounded-full bg-destructive animate-pulse shrink-0" />
        <span className="text-sm font-medium text-destructive tabular-nums">{formatDuration(duration)}</span>
        <span className="text-sm text-muted-foreground flex-1">در حال ضبط...</span>
        <Button type="button" size="icon" variant="destructive" className="size-9 rounded-full shrink-0" onClick={stopRecording}>
          <Square className="size-4 fill-current" />
        </Button>
      </div>
    );
  }

  // صدای جدید ضبط شده
  if (value instanceof Blob && newAudioUrl) {
    return renderPlayer(newAudioUrl, deleteAudio);
  }

  // صدای موجود از سرور (ادیت) — هنوز حذف نشده
  if (value === null && existingUrl) {
    return (
      <div className="flex flex-col gap-2">
        {renderPlayer(existingUrl, () => onChange("remove"), "صدای فعلی")}
      </div>
    );
  }

  // پاک شده توسط کاربر
  if (value === "remove") {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-destructive/40 bg-destructive/5">
        <p className="text-sm text-muted-foreground flex-1">صدا حذف خواهد شد</p>
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => onChange(null)}>بازگشت</Button>
      </div>
    );
  }

  // آماده ضبط
  return (
    <button
      type="button"
      onClick={startRecording}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl border border-dashed border-border",
        "hover:border-primary hover:bg-primary/5 transition-colors text-right"
      )}
    >
      <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Mic className="size-4 text-muted-foreground" />
      </div>
      <span className="text-sm text-muted-foreground">برای ضبط صدا کلیک کنید</span>
    </button>
  );
}
