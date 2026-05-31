import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { getMyFolders, getMyMemories } from "@/actions/memory";
import { redirect } from "next/navigation";
import DashboardTabs from "@/components/panel/memories/dashboard-tabs";

export const metadata: Metadata = {
  title: "خاطرات من | یادگار",
};

export default async function DashboardPage() {
  const user = await getMyInfo();
  if (!user) redirect("/login");

  const [folders, memories] = await Promise.all([
    getMyFolders(),
    getMyMemories(),
  ]);

  return (
    <div className="flex flex-col gap-5 py-6">
      <h1 className="text-2xl font-black">خاطرات من</h1>
      <DashboardTabs initialFolders={folders} initialMemories={memories} />
    </div>
  );
}
