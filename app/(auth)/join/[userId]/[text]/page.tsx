import { Metadata } from "next";
import { getAuthToken } from "@/actions/auth";
import JoinConfirm from "@/components/join/join-confirm";

export const metadata: Metadata = {
  title: "دعوت به حلقه رفیقان | یادگار",
};

interface Props {
  params: Promise<{ userId: string; text: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { userId, text } = await params;
  const token = await getAuthToken();
  const returnUrl = `/join/${userId}/${text}`;

  return (
    <div className="w-full max-w-sm px-4">
      <JoinConfirm
        text={text}
        isLoggedIn={!!token}
        returnUrl={returnUrl}
      />
    </div>
  );
}
