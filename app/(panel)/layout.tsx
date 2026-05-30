import BottomNav from "@/components/layout/bottom-nav";
import TopBar from "@/components/layout/top-bar";
import { ReactNode } from "react";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 pt-14 pb-24 max-w-lg mx-auto w-full px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
