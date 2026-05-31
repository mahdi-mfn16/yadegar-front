import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import CreateMemoryForm from "@/components/panel/memories/create-memory-form";

export const metadata: Metadata = {
  title: "خاطره جدید | یادگار",
};

interface Props {
  searchParams: Promise<{ folder_id?: string }>;
}

export default async function NewMemoryPage({ searchParams }: Props) {
  const user = await getMyInfo();
  if (!user) redirect("/login");

  const params = await searchParams;
  const folderId = params.folder_id ? Number(params.folder_id) : null;

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-9 -mr-1" asChild>
          <Link href="/panel/dashboard">
            <ChevronRight className="size-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-black">خاطره جدید</h1>
      </div>
      <CreateMemoryForm mode="create" initialFolderId={folderId} />
    </div>
  );
}
