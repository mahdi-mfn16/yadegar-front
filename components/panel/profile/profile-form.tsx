"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/actions/user";
import { logout } from "@/actions/auth";
import {
  updateProfileSchema,
  type UpdateProfileData,
  type UserType,
} from "@/types/userType";
import { LogOut, User, Phone } from "lucide-react";

interface Props {
  user: UserType;
}

export default function ProfileForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      username: user.username ?? "",
      gender: user.gender ?? undefined,
    },
  });

  function onSubmit(data: UpdateProfileData) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      if (data.gender !== undefined && data.gender !== null) {
        formData.append("gender", data.gender ? "1" : "0");
      }

      const result = await updateProfile(user.id, formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("پروفایل بروزرسانی شد");
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* آواتار و اطلاعات کلی */}
      <div className="flex flex-col items-center gap-3 py-4">
        <Avatar className="size-20 ring-4 ring-primary/20">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-0.5">
          <p className="font-bold text-lg leading-tight">
            {user.name || "نام تنظیم نشده"}
          </p>
          <div className="flex items-center gap-1.5 text-muted-foreground justify-center">
            <Phone className="size-3.5" />
            <p className="text-sm" dir="ltr">
              {user.mobile}
            </p>
          </div>
        </div>
      </div>

      {/* فرم ویرایش */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ویرایش اطلاعات</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-base font-medium">
                نام و نام خانوادگی
              </Label>
              <Input
                id="name"
                className="h-11"
                placeholder="مثال: علی محمدی"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-base font-medium">
                نام کاربری
              </Label>
              <Input
                id="username"
                className="h-11"
                dir="ltr"
                placeholder="example_user"
                {...form.register("username")}
              />
              {form.formState.errors.username && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 text-base mt-2 w-full"
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* خروج */}
      <Button
        variant="destructive"
        size="lg"
        className="h-12 text-base w-full gap-2"
        onClick={handleLogout}
        disabled={isPending}
      >
        <LogOut className="size-5" />
        خروج از حساب
      </Button>
    </div>
  );
}
