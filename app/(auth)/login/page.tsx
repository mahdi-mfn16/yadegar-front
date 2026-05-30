import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "ورود | یادگار",
  description: "برای ورود شماره موبایل خود را وارد کنید",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      {/* لوگو و عنوان */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
          <span className="text-primary-foreground text-3xl font-black">ی</span>
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-foreground">یادگار</h1>
          <p className="text-muted-foreground text-base">
            فضایی برای ثبت خاطرات ماندگار
          </p>
        </div>
      </div>

      {/* فرم ورود */}
      <LoginForm />

      <p className="text-center text-xs text-muted-foreground mt-6">
        با ورود، قوانین و شرایط استفاده را می‌پذیرید
      </p>
    </div>
  );
}
