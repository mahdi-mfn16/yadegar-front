import z from "zod";

export interface UserPublicType {
  id: number;
  name: string | null;
  username: string | null;
  avatar: string; // URL string از getFileUrl
}

export interface FolderType {
  id: number;
  title: string;
  description: string | null;
  memories?: MemoryType[];
}

export type MemoryVisibility = "private" | "family" | "public" | "anonymous";

export const VISIBILITY_OPTIONS: { value: MemoryVisibility; label: string }[] = [
  { value: "private", label: "خصوصی — فقط خودم" },
  { value: "family", label: "خانوادگی — خانواده‌ام" },
  { value: "public", label: "عمومی — همه با نامم" },
  { value: "anonymous", label: "ناشناس — همه بدون نامم" },
];

export const VISIBILITY_BADGE: Record<
  MemoryVisibility,
  { label: string; className: string }
> = {
  private: {
    label: "خصوصی",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0",
  },
  family: {
    label: "خانوادگی",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0",
  },
  public: {
    label: "عمومی",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0",
  },
  anonymous: {
    label: "ناشناس",
    className:
      "bg-muted text-muted-foreground border-0",
  },
};

export interface MediaFileType {
  id?: number;
  name?: string;
  alt?: string;
  file: string; // cdn_url/path — از FileCompactResource
}

export interface MemoryType {
  id: number;
  folder_id: number | null;
  title: string | null;
  text: string | null;
  visibility: MemoryVisibility;
  date: string | null;
  location: string | null;
  photo: MediaFileType | null;
  audio: MediaFileType | null;
  video: MediaFileType | null;
  user?: UserPublicType | null;
  folder?: FolderType | null;
}

export const folderSchema = z.object({
  title: z
    .string()
    .min(1, "عنوان الزامی است")
    .max(50, "عنوان نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
  description: z.string().nullable().optional(),
});
export type FolderFormData = z.infer<typeof folderSchema>;

export const memoryStep1Schema = z.object({
  title: z.string().max(100, "عنوان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد").optional().nullable(),
  text: z.string().optional().nullable(),
  folder_id: z.number().nullable().optional(),
});
export type MemoryStep1Data = z.infer<typeof memoryStep1Schema>;

export const memoryStep3Schema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ نامعتبر است")
    .nullable()
    .optional(),
  visibility: z.enum(["private", "family", "public", "anonymous"], {
    required_error: "نوع دسترسی الزامی است",
  }),
});
export type MemoryStep3Data = z.infer<typeof memoryStep3Schema>;

export interface MemoryFormState {
  title: string;
  text: string;
  folder_id: number | null;
  photo: File | null | "remove";
  video: File | null | "remove";
  audioBlob: Blob | null | "remove";
  date: string;
  visibility: MemoryVisibility | "";
}

export const MEMORY_FORM_INITIAL: MemoryFormState = {
  title: "",
  text: "",
  folder_id: null,
  photo: null,
  video: null,
  audioBlob: null,
  date: "",
  visibility: "",
};
