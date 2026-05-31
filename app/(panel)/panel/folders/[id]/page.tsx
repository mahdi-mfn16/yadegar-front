import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { getFolder, getMyMemories } from "@/actions/memory";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Folder } from "lucide-react";
import MemoryList from "@/components/panel/memories/memory-list";

export const metadata: Metadata = {
  title: "فولدر | یادگار",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FolderPage({ params }: Props) {
  const user = await getMyInfo();
  if (!user) redirect("/login");

  const { id } = await params;
  const [folder, allMemories] = await Promise.all([
    getFolder(Number(id)),
    getMyMemories(),
  ]);
  if (!folder) notFound();

  const folderMemories = allMemories.filter(
    (m) => m.folder?.id === Number(id)
  );

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-9 -mr-1" asChild>
          <Link href="/panel/dashboard">
            <ChevronRight className="size-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Folder className="size-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black leading-tight">{folder.title}</h1>
            {folder.description && (
              <p className="text-xs text-muted-foreground">{folder.description}</p>
            )}
          </div>
        </div>
      </div>

      <MemoryList
        initialMemories={folderMemories}
        folderId={Number(id)}
      />
    </div>
  );
}
