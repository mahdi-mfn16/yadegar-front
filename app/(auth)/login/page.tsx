import { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ورود | یادگار",
  description: "برای ورود شماره موبایل خود را وارد کنید",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      {/* لوگو و عنوان */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 overflow-hidden">
          {/* <span className="text-primary-foreground text-3xl font-black">ی</span> */}
          <Image
          src="/logo.png"
          alt="یادگار"
          fill
          className="object-cover hover:brightness-95 transition-[filter] duration-200"
          sizes="80px"
        />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-foreground">یادگار</h1>
          <p className="text-muted-foreground text-base">
            فضایی برای ثبت خاطرات ماندگار
          </p>
        </div>
      </div>

      {/* فرم ورود — Suspense برای useSearchParams */}
      <Suspense fallback={
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-5">
          <Skeleton className="h-5 w-40 mx-auto" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      }>
        <LoginForm />
      </Suspense>

      <p className="text-center text-xs text-muted-foreground mt-6">
        با ورود، قوانین و شرایط استفاده را می‌پذیرید
      </p>
    </div>
  );
}
