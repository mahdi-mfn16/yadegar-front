import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { getFamilyMembers } from "@/actions/family";
import { redirect } from "next/navigation";
import Link from "next/link";
import AvatarUpload from "@/components/panel/profile/avatar-upload";
import LogoutButton from "@/components/panel/profile/logout-button";
import {
  ChevronLeft,
  UserCog,
  Users2,
  Bell,
  ShieldCheck,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "پروفایل | یادگار",
};

export default async function ProfilePage() {
  const [user, members] = await Promise.all([
    getMyInfo(),
    getFamilyMembers(),
  ]);

  if (!user) redirect("/login");

  const safeMembers = Array.isArray(members) ? members : [];
  const acceptedCount = safeMembers.filter((m) => m.status === 1).length;
  const pendingCount = safeMembers.filter((m) => m.status === 0).length;

  const memberSummary =
    safeMembers.length === 0
      ? "هنوز عضوی دعوت نشده"
      : `${acceptedCount} عضو فعال${pendingCount > 0 ? ` · ${pendingCount} در انتظار` : ""}`;

  return (
    <div className="flex flex-col gap-5 py-6">
      {/* آواتار، نام، موبایل */}
      <div className="flex flex-col items-center gap-3 py-2">
        <AvatarUpload user={user} />
        <div className="text-center space-y-1">
          <p className="font-black text-xl leading-tight">
            {user.name || "نام تنظیم نشده"}
          </p>
          <div className="flex items-center gap-1.5 text-muted-foreground justify-center">
            <Phone className="size-3.5" />
            <p className="text-sm" dir="ltr">
              {user.mobile}
            </p>
          </div>
        </div>
      </div>

      {/* لیست تنظیمات */}
      <div className="rounded-xl overflow-hidden border border-border divide-y divide-border bg-card">
        {/* ویرایش اطلاعات */}
        <Link
          href="/panel/profile/edit"
          className="flex items-center gap-3 px-4 py-4 hover:bg-muted/50 active:bg-muted transition-colors"
        >
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UserCog className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base">ویرایش اطلاعات شخصی</p>
            <p className="text-sm text-muted-foreground">
              نام، نام کاربری، جنسیت، تاریخ تولد
            </p>
          </div>
          <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
        </Link>

        {/* اعضای خانواده */}
        <Link
          href="/panel/profile/family"
          className="flex items-center gap-3 px-4 py-4 hover:bg-muted/50 active:bg-muted transition-colors"
        >
          <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users2 className="size-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base">رفیقان</p>
            <p className="text-sm text-muted-foreground">{memberSummary}</p>
          </div>
          <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
        </Link>

        {/* اعلانات — آینده */}
        <div className="flex items-center gap-3 px-4 py-4 opacity-40 cursor-not-allowed">
          <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Bell className="size-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base">اعلانات</p>
            <p className="text-sm text-muted-foreground">به زودی...</p>
          </div>
          <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
        </div>

        {/* امنیت — آینده */}
        <div className="flex items-center gap-3 px-4 py-4 opacity-40 cursor-not-allowed">
          <div className="size-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base">امنیت</p>
            <p className="text-sm text-muted-foreground">به زودی...</p>
          </div>
          <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
