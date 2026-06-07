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
import { inviteToFamily } from "@/actions/family";
import { inviteMemberSchema, type InviteMemberData } from "@/types/familyType";
import { UserPlus, Smartphone } from "lucide-react";

export default function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<InviteMemberData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { mobile: "", name: "" },
  });

  function onSubmit(data: InviteMemberData) {
    startTransition(async () => {
      const result = await inviteToFamily(data.mobile, data.name || undefined);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("دعوتنامه ارسال شد");
      setOpen(false);
      form.reset();
    });
  }

  return (
    <>
      <Button
        size="sm"
        className="gap-1.5 shrink-0"
        onClick={() => setOpen(true)}
      >
        <UserPlus className="size-4" />
        دعوت
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="mr-6">دعوت از عضو جدید</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 pt-2"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="inv-name" className="text-base font-medium">
                نام (اختیاری)
              </Label>
              <Input
                id="inv-name"
                className="h-11"
                placeholder="مثال: مادر، پدر، برادر..."
                {...form.register("name")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="inv-mobile" className="text-base font-medium">
                شماره موبایل
              </Label>
              <div className="relative">
                <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="inv-mobile"
                  type="tel"
                  dir="ltr"
                  placeholder="09xxxxxxxxx"
                  maxLength={11}
                  className="h-11 pr-10 text-center tracking-widest"
                  {...form.register("mobile")}
                />
              </div>
              {form.formState.errors.mobile && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.mobile.message}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
              لینک دعوت به این شماره پیامک می‌شود. عضو بعد از ثبت‌نام باید دعوت را تایید کند.
            </p>

            <DialogFooter className="flex-row gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { setOpen(false); form.reset(); }}
                disabled={isPending}
              >
                انصراف
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "در حال ارسال..." : "ارسال دعوت"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
