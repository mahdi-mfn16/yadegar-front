import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <ThemeToggle />
        <div className="flex items-center gap-1.5">
          <img
              src="/logo-rounded.png"
              alt="یادگار"
              className="w-10 h-10 object-cover rounded-full"
            />
          <span className="text-xl font-black text-primary tracking-tight">
            یادگار
          </span>
        </div>
        {/* فضای خالی برای تراز از چپ */}
        <div className="size-8" />
      </div>
    </header>
  );
}
