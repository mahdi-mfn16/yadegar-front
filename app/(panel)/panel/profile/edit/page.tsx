import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "@/components/panel/profile/profile-form";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "ویرایش پروفایل | یادگار",
};

export default async function ProfileEditPage() {
  const user = await getMyInfo();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="flex items-center gap-2">
        <Link
          href="/panel/profile"
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowRight className="size-5" />
        </Link>
        <h1 className="text-xl font-black">ویرایش اطلاعات شخصی</h1>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
