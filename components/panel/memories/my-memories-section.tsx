"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import FolderList from "./folder-list";
import MemoryList from "./memory-list";
import type { FolderType, MemoryType } from "@/types/memoryType";

interface Props {
  initialFolders: FolderType[];
  initialMemories: MemoryType[];
}

const TABS = [
  { key: "folders", label: "آلبوم ها" },
  { key: "memories", label: "همه خاطرات" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MyMemoriesSection({ initialFolders, initialMemories }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("folders");

  return (
    <div className="flex flex-col gap-4">
      {/* تب‌های داخلی */}
      <div className="flex bg-muted rounded-lg p-1 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "folders" ? (
        <FolderList initialFolders={initialFolders} />
      ) : (
        <MemoryList initialMemories={initialMemories} />
      )}
    </div>
  );
}
