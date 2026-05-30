import { Metadata } from "next";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "کاوش خاطرات | یادگار",
};

export default function ExplorePage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Compass className="size-6 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-black">کاوش خاطرات</h1>
        <p className="text-muted-foreground">
          خاطرات مشترک را کشف کنید
        </p>
      </div>

      {/* در مرحله بعد: لیست خاطرات عمومی */}
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-base">به زودی...</p>
      </div>
    </div>
  );
}
