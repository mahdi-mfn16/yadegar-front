import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { getFamilyMembers } from "@/actions/family";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InviteMemberDialog from "@/components/panel/family/invite-member-dialog";
import FamilyList from "@/components/panel/family/family-list";

export const metadata: Metadata = {
  title: "رفیقان | یادگار",
};

export default async function FamilyPage() {
  const user = await getMyInfo();
  if (!user) redirect("/login");

  const members = await getFamilyMembers();

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/panel/profile"
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowRight className="size-5" />
          </Link>
          <h1 className="text-xl font-black">رفیقان</h1>
        </div>
        <InviteMemberDialog />
      </div>

      <FamilyList initialMembers={members} />
    </div>
  );
}
