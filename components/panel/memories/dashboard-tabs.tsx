"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import MyMemoriesSection from "./my-memories-section";
import { Users } from "lucide-react";
import type { FolderType, MemoryType } from "@/types/memoryType";

interface Props {
  initialFolders: FolderType[];
  initialMemories: MemoryType[];
}

const TABS = [
  { key: "mine", label: "خاطرات من" },
  { key: "family", label: "خانوادگی" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function DashboardTabs({ initialFolders, initialMemories }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("mine");

  return (
    <div className="flex flex-col gap-4">
      {/* تب‌های اصلی */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "mine" ? (
        <MyMemoriesSection
          initialFolders={initialFolders}
          initialMemories={initialMemories}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
            <Users className="size-7" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-medium">بخش خانوادگی</p>
            <p className="text-sm">به زودی فعال می‌شود</p>
          </div>
        </div>
      )}
    </div>
  );
}
