import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/panel/profile/profile-form";

export const metadata: Metadata = {
  title: "پروفایل | یادگار",
};

export default async function ProfilePage() {
  const user = await getMyInfo();

  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-black">پروفایل من</h1>
      <ProfileForm user={user} />
    </div>
  );
}
