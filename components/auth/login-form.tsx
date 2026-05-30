"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { sendLoginCode, verifyCode, resendCode } from "@/actions/auth";
import {
  sendCodeSchema,
  checkCodeSchema,
  type SendCodeData,
  type CheckCodeData,
} from "@/types/userType";
import { ArrowRight, Smartphone, KeyRound } from "lucide-react";

export default function LoginForm() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [isPending, startTransition] = useTransition();
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  const mobileForm = useForm<SendCodeData>({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: { mobile: "" },
  });

  const otpForm = useForm<CheckCodeData>({
    resolver: zodResolver(checkCodeSchema),
    defaultValues: { mobile: "", code: "" },
  });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  function startResendTimer() {
    setResendTimer(90);
  }

  function onMobileSubmit(data: SendCodeData) {
    startTransition(async () => {
      const result = await sendLoginCode(data.mobile);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setMobile(data.mobile);
      otpForm.setValue("mobile", data.mobile);
      setStep("otp");
      startResendTimer();
      toast.success("کد تایید ارسال شد");
    });
  }

  function onOtpSubmit(data: CheckCodeData) {
    startTransition(async () => {
      const result = await verifyCode(data.mobile, data.code);
      if (result.error) {
        toast.error(result.error);
        otpForm.setError("code", { message: result.error });
        return;
      }
      toast.success("خوش آمدید!");
      router.push("/panel/dashboard");
      router.refresh();
    });
  }

  function handleResend() {
    if (resendTimer > 0 || isPending) return;
    startTransition(async () => {
      const result = await resendCode(mobile);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("کد مجددا ارسال شد");
      startResendTimer();
    });
  }

  if (step === "mobile") {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6 pb-6">
          <form
            onSubmit={mobileForm.handleSubmit(onMobileSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="text-center mb-1">
              <h2 className="text-lg font-bold">ورود با شماره موبایل</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                کد تایید برای شما پیامک می‌شود
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="mobile" className="text-base font-medium">
                شماره موبایل
              </Label>
              <div className="relative">
                <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="09xxxxxxxxx"
                  dir="ltr"
                  className="h-12 text-base pr-10 text-center tracking-widest"
                  maxLength={11}
                  {...mobileForm.register("mobile")}
                />
              </div>
              {mobileForm.formState.errors.mobile && (
                <p className="text-destructive text-sm">
                  {mobileForm.formState.errors.mobile.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 text-base w-full"
              disabled={isPending}
            >
              {isPending ? "در حال ارسال..." : "دریافت کد تایید"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6 pb-6">
        <form
          onSubmit={otpForm.handleSubmit(onOtpSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={() => setStep("mobile")}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
              aria-label="بازگشت"
            >
              <ArrowRight className="size-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold">کد تایید</h2>
              <p className="text-sm text-muted-foreground">
                کد ارسالی به{" "}
                <span className="font-semibold text-foreground" dir="ltr">
                  {mobile}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="code" className="text-base font-medium">
              کد ۶ رقمی
            </Label>
            <div className="relative">
              <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="- - - - - -"
                dir="ltr"
                maxLength={6}
                className="h-12 text-lg pr-10 text-center tracking-[0.4em]"
                {...otpForm.register("code")}
              />
            </div>
            {otpForm.formState.errors.code && (
              <p className="text-destructive text-sm">
                {otpForm.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 text-base w-full"
            disabled={isPending}
          >
            {isPending ? "در حال تایید..." : "ورود به یادگار"}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isPending}
            className="text-sm text-center text-muted-foreground disabled:opacity-50 hover:text-primary transition-colors"
          >
            {resendTimer > 0
              ? `ارسال مجدد کد تا ${resendTimer} ثانیه دیگر`
              : "ارسال مجدد کد"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
