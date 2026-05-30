import z from "zod";

export interface RoleType {
  id: number;
  name: string;
  key: string;
}

export interface UserType {
  id: number;
  name: string | null;
  username: string | null;
  mobile: string;
  national_code: string | null;
  gender: boolean | null;
  birth_date: string | null;
  avatar: string | null;
  role?: RoleType | null;
}

export interface AuthStateType {
  user: UserType | null;
  isAuthenticated: boolean;
}

export const sendCodeSchema = z.object({
  mobile: z
    .string()
    .length(11, "شماره موبایل باید ۱۱ رقم باشد")
    .regex(/^09/, "شماره موبایل باید با ۰۹ شروع شود"),
});

export const checkCodeSchema = z.object({
  mobile: z.string().length(11),
  code: z.string().length(6, "کد تایید باید ۶ رقم باشد"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
  username: z
    .string()
    .max(30, "نام کاربری نمی‌تواند بیشتر از ۳۰ کاراکتر باشد"),
  gender: z.boolean().nullable().optional(),
});

export type SendCodeData = z.infer<typeof sendCodeSchema>;
export type CheckCodeData = z.infer<typeof checkCodeSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
