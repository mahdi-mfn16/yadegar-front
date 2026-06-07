import { Metadata } from "next";
import { getFriendsMemories, getPublicMemories } from "@/actions/explore";
import { Users } from "lucide-react";
import ExploreFeed from "@/components/explore/explore-feed";

export const metadata: Metadata = {
  title: "خاطرات دوستان | یادگار",
};

export default async function FreiendsExplorePage() {

    const { items, currentPage, lastPage } = await getFriendsMemories(1);
  
    return (
      <div className="flex flex-col gap-5 py-6">
        <div className="rounded-2xl bg-linear-to-l from-primary/10 via-primary/5 to-transparent border border-border/40 px-4 py-4">
          <h1 className="text-xl font-black tracking-tight">حلقه یادگار</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            دلا یاران سه قسمند ار بدانی&emsp;زبانی اند و نانی اند و جانی<br></br>
تو لیکن یار جانی را نگه دار&emsp;به پایش جان بده تا می توانی<br></br>
          </p>
          <p className="text-sm text-foreground mt-1 text-left">مولانا</p>
        </div>
  
        <ExploreFeed
          initialItems={items}
          initialPage={currentPage}
          initialLastPage={lastPage}
        />
      </div>
    );
}
