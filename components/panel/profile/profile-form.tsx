"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PersianDatePicker from "@/components/ui/persian-date-picker";
import AvatarUpload from "@/components/panel/profile/avatar-upload";
import { updateProfile } from "@/actions/user";
import { logout } from "@/actions/auth";
import {
  updateProfileSchema,
  type UpdateProfileData,
  type UserType,
} from "@/types/userType";
import { LogOut, Phone } from "lucide-react";

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
      gender: user.gender ? Boolean(user.gender) : undefined,
      birth_date: user.birth_date ?? "",
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
      if (data.birth_date) {
        formData.append("birth_date", data.birth_date);
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
      {/* آواتار */}
      <div className="flex flex-col items-center gap-3 py-4">
        <AvatarUpload user={user} />
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

            {/* جنسیت */}
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">جنسیت</Label>
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <RadioGroup
                    dir="rtl"
                    value={
                      field.value === true
                        ? "male"
                        : field.value === false
                          ? "female"
                          : ""
                    }
                    onValueChange={(val) =>
                      field.onChange(
                        val === "male" ? true : val === "female" ? false : null
                      )
                    }
                    className="flex gap-3"
                  >
                    <div className="flex items-center gap-2 border rounded-lg px-4 py-3 flex-1 cursor-pointer has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label
                        htmlFor="gender-male"
                        className="text-base cursor-pointer"
                      >
                        مرد
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 border rounded-lg px-4 py-3 flex-1 cursor-pointer has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label
                        htmlFor="gender-female"
                        className="text-base cursor-pointer"
                      >
                        زن
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* تاریخ تولد شمسی */}
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">تاریخ تولد</Label>
              <Controller
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <PersianDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="مثال: ۱۳۶۰/۰۱/۰۱"
                    disabled={isPending}
                  />
                )}
              />
              {form.formState.errors.birth_date && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.birth_date.message}
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
