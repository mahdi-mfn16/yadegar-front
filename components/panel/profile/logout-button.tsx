"use client";

import { useTransition } from "react";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="lg"
      className="h-12 text-base w-full gap-2"
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
    >
      <LogOut className="size-5" />
      {isPending ? "در حال خروج..." : "خروج از حساب"}
    </Button>
  );
}
