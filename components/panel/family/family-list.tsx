"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { removeFromFamily, updateFamilyMemberName } from "@/actions/family";
import {
  updateMemberNameSchema,
  type UpdateMemberNameData,
  type FamilyMemberType,
} from "@/types/familyType";
import { Pencil, Trash2, User, Clock, CheckCircle2, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  initialMembers: FamilyMemberType[];
}

export default function FamilyList({ initialMembers }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [editTarget, setEditTarget] = useState<FamilyMemberType | null>(null);
  const [removeTarget, setRemoveTarget] = useState<FamilyMemberType | null>(null);
  const [isPending, startTransition] = useTransition();

  const editForm = useForm<UpdateMemberNameData>({
    resolver: zodResolver(updateMemberNameSchema),
    defaultValues: { name: "" },
  });

  function openEdit(member: FamilyMemberType) {
    editForm.reset({ name: member.name ?? "" });
    setEditTarget(member);
  }

  function onEditSubmit(data: UpdateMemberNameData) {
    if (!editTarget) return;
    startTransition(async () => {
      const result = await updateFamilyMemberName(editTarget.id, data.name);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editTarget.id ? { ...m, name: data.name } : m
        )
      );
      toast.success("نام ویرایش شد");
      setEditTarget(null);
    });
  }

  function onRemoveConfirm() {
    if (!removeTarget) return;
    startTransition(async () => {
      const result = await removeFromFamily(removeTarget.member_id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
      toast.success("عضو حذف شد");
      setRemoveTarget(null);
    });
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <Users2 className="size-7" />
        </div>
        <div className="text-center space-y-0.5">
          <p className="font-medium">هنوز عضوی دعوت نشده</p>
          <p className="text-sm">از دکمه «دعوت» رفیق خود را اضافه کنید</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3"
          >
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {member.name
                  ? member.name.charAt(0)
                  : <User className="size-4" />}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center flex-1 min-w-0 justify-between">
              <p className="font-semibold text-base truncate ">
                {member.name || "بدون نام"}
              </p>
              <p className="text-sm text-muted-foreground" dir="ltr">
                {member.mobile}
              </p>
            </div>

            {/* استتوس */}
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0",
                member.status === 1
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              {member.status === 1 ? (
                <><CheckCircle2 className="size-3" /> فعال</>
              ) : (
                <><Clock className="size-3" /> در انتظار</>
              )}
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEdit(member)}
                aria-label="ویرایش نام"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setRemoveTarget(member)}
                aria-label="حذف عضو"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* دیالوگ ویرایش نام */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="mr-6">ویرایش نام عضو</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="flex flex-col gap-4 pt-2"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name" className="text-base">نام</Label>
              <Input
                id="edit-name"
                className="h-11"
                placeholder="مثال: مادر، پدر..."
                {...editForm.register("name")}
              />
              {editForm.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <DialogFooter className="flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setEditTarget(null)}
                disabled={isPending}
              >
                انصراف
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "ذخیره..." : "ذخیره"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* دیالوگ تایید حذف */}
      <Dialog open={!!removeTarget} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="mr-6">حذف عضو</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            آیا مطمئن هستید که{" "}
            <span className="font-bold text-foreground">
              {removeTarget?.name || removeTarget?.mobile}
            </span>{" "}
            را از رفیقان حذف کنید؟
          </p>
          <DialogFooter className="flex-row gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setRemoveTarget(null)}
              disabled={isPending}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onRemoveConfirm}
              disabled={isPending}
            >
              {isPending ? "در حال حذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
