"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="تغییر حالت نمایش"
    >
      {/* هر دو آیکون همیشه رندر می‌شن — CSS تعیین می‌کنه کدام نمایش داده شه */}
      <Sun className="size-5 hidden dark:block" />
      <Moon className="size-5 dark:hidden" />
    </Button>
  );
}
