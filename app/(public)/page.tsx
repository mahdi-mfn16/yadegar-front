import { Metadata } from "next";
import { getPublicMemories } from "@/actions/explore";
import ExploreFeed from "@/components/explore/explore-feed";

export const metadata: Metadata = {
  title: "خاطرات مشترک | یادگار",
};

export default async function ExplorePage() {
  const { items, currentPage, lastPage } = await getPublicMemories(1);

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="rounded-2xl bg-linear-to-l from-primary/10 via-primary/5 to-transparent border border-border/40 px-4 py-4">
        <h1 className="text-xl font-black tracking-tight">خاطرات مشترک</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          لحظاتی که مردم از زندگی‌شان با دیگران به اشتراک گذاشته‌اند
        </p>
      </div>

      <ExploreFeed
        initialItems={items}
        initialPage={currentPage}
        initialLastPage={lastPage}
      />
    </div>
  );
}
