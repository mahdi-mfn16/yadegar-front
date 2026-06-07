import { Metadata } from "next";
import { getFriendsMemories } from "@/actions/explore";
import ExploreFeed from "@/components/explore/explore-feed";

export const metadata: Metadata = {
  title: "یادگار رفیقان | یادگار",
};

export default async function FriendsExplorePage() {
  const { items, currentPage, lastPage } = await getFriendsMemories(1);

  return (
    <div className="flex flex-col gap-5 py-6">
      <div className="rounded-2xl bg-linear-to-l from-primary/10 via-primary/5 to-transparent border border-border/40 px-4 py-4">
        <h1 className="text-xl font-black tracking-tight">یادگار رفیقان</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          دلا یاران سه قسمند ار بدانی&emsp;زبانی اند و نانی اند و جانی
          <br />
          تو لیکن یار جانی را نگه دار&emsp;به پایش جان بده تا می توانی
        </p>
        <p className="text-sm text-foreground mt-1 text-left">مولانا</p>
      </div>

      <ExploreFeed
        initialItems={items}
        initialPage={currentPage}
        initialLastPage={lastPage}
        fetchFn={getFriendsMemories}
        emptyIcon="friends"
        emptyText="خاطره‌ای از رفیقان وجود ندارد"
      />
    </div>
  );
}
