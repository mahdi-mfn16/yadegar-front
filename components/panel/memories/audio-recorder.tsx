"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: Blob | null;
  onChange: (blob: Blob | null) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function AudioRecorder({ value, onChange }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!value && audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setDuration(0);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
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

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const type = mimeType.includes("ogg") ? "audio/ogg" : "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange(blob);
        setIsRecording(false);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      alert("دسترسی به میکروفون رد شد");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }

  function deleteRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setDuration(0);
    onChange(null);
  }

  function togglePlay() {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  // حالت: در حال ضبط
  if (isRecording) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-destructive/30 bg-destructive/5">
        <span className="size-2.5 rounded-full bg-destructive animate-pulse flex-shrink-0" />
        <span className="text-sm font-medium text-destructive tabular-nums">
          {formatDuration(duration)}
        </span>
        <span className="text-sm text-muted-foreground flex-1">در حال ضبط...</span>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="size-9 rounded-full flex-shrink-0"
          onClick={stopRecording}
        >
          <Square className="size-4 fill-current" />
        </Button>
      </div>
    );
  }

  // حالت: صدا ضبط شده
  if (audioUrl) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-9 rounded-full flex-shrink-0"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>
        <div className="flex-1">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
          {formatDuration(duration)}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 text-destructive hover:text-destructive flex-shrink-0"
          onClick={deleteRecording}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    );
  }

  // حالت: آماده ضبط
  return (
    <button
      type="button"
      onClick={startRecording}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl border border-dashed border-border",
        "hover:border-primary hover:bg-primary/5 transition-colors text-right"
      )}
    >
      <div className="size-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <Mic className="size-4 text-muted-foreground" />
      </div>
      <span className="text-sm text-muted-foreground">
        برای ضبط صدا کلیک کنید
      </span>
    </button>
  );
}
