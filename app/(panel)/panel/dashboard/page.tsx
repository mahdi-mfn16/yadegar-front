import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { redirect } from "next/navigation";
import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "خاطرات من | یادگار",
};

export default async function DashboardPage() {
  const user = await getMyInfo();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* خوش‌آمدگویی */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black">
          سلام {user.name || "کاربر عزیز"} 👋
        </h1>
        <p className="text-muted-foreground text-base">
          خاطرات خود را ثبت و مرور کنید
        </p>
      </div>

      {/* دکمه ثبت خاطره جدید */}
      <Button
        size="lg"
        className="h-12 text-base w-full gap-2"
        disabled
      >
        <PlusCircle className="size-5" />
        ثبت خاطره جدید
      </Button>

      {/* وضعیت خالی */}
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <BookOpen className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-medium">هنوز خاطره‌ای ثبت نشده</p>
          <p className="text-sm">اولین خاطره خود را بنویسید</p>
        </div>
      </div>
    </div>
  );
}
