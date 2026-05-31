import { Metadata } from "next";
import { getMyInfo } from "@/actions/user";
import { getMemory } from "@/actions/memory";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import CreateMemoryForm from "@/components/panel/memories/create-memory-form";

export const metadata: Metadata = {
  title: "ویرایش خاطره | یادگار",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemoryPage({ params }: Props) {
  const user = await getMyInfo();
  if (!user) redirect("/login");

  const { id } = await params;
  const memory = await getMemory(Number(id));
  if (!memory) notFound();

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-9 -mr-1" asChild>
          <Link href="/panel/dashboard">
            <ChevronRight className="size-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-black">ویرایش خاطره</h1>
      </div>
      <CreateMemoryForm mode="edit" initialMemory={memory} />
    </div>
  );
}
