"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { joinToFamily } from "@/actions/family";
import Link from "next/link";
import { Users2, LogIn, CheckCircle2 } from "lucide-react";

interface Props {
  text: string;
  isLoggedIn: boolean;
  returnUrl: string;
}

export default function JoinConfirm({ text, isLoggedIn, returnUrl }: Props) {
  const [joined, setJoined] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleJoin() {
    startTransition(async () => {
      const result = await joinToFamily(text);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setJoined(true);
      setTimeout(() => router.push("/panel/dashboard"), 1800);
    });
  }

  if (joined) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="size-10 text-green-500" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black">به یادگار رفیقان پیوستید!</h1>
          <p className="text-muted-foreground">در حال انتقال به داشبورد...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Users2 className="size-10 text-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black">دعوت به حلقه رفیقان</h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            برای پذیرش این دعوت، ابتدا وارد یادگار شوید
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="h-12 text-base w-full gap-2"
        >
          <Link href={`/login?redirect=${encodeURIComponent(returnUrl)}`}>
            <LogIn className="size-5" />
            ورود به یادگار
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
        <Users2 className="size-10 text-primary" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-black">دعوت به حلقه رفیقان</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          شما به عنوان رفیق دعوت شده‌اید.<br />
          برای پذیرش دعوت دکمه زیر را بزنید.
        </p>
      </div>
      <Button
        size="lg"
        className="h-12 text-base w-full"
        onClick={handleJoin}
        disabled={isPending}
      >
        {isPending ? "در حال پردازش..." : "پذیرش دعوت"}
      </Button>
    </div>
  );
}
