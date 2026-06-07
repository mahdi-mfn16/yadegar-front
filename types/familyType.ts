import z from "zod";

export interface FamilyMemberType {
  id: number;
  member_id: number; // ⚠ backend باید این رو به FamilyResource اضافه کنه
  name: string | null;
  mobile: string;
  status: 0 | 1; // 0 = در انتظار، 1 = عضو فعال
}

export const inviteMemberSchema = z.object({
  mobile: z
    .string()
    .length(11, "شماره موبایل باید ۱۱ رقم باشد")
    .regex(/^09/, "شماره موبایل باید با ۰۹ شروع شود"),
  name: z
    .string()
    .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
    .optional(),
});

export const updateMemberNameSchema = z.object({
  name: z.string().min(1, "نام نمی‌تواند خالی باشد").max(50),
});

export type InviteMemberData = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberNameData = z.infer<typeof updateMemberNameSchema>;
