"use client";

import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { cn } from "@/lib/utils";

interface PersianDatePickerProps {
  value: string | null | undefined;
  onChange: (gregorianDate: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function PersianDatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  disabled,
  className,
}: PersianDatePickerProps) {
  const pickerValue = value
    ? new DateObject({ date: value, calendar: gregorian, locale: gregorian_en }).convert(
        persian,
        persian_fa
      )
    : undefined;

  function handleChange(date: DateObject | null) {
    if (!date || !date.isValid) {
      onChange(null);
      return;
    }
    const gregorianDate = date.convert(gregorian, gregorian_en);
    const formatted = gregorianDate.format("YYYY-MM-DD");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
      onChange(null);
      return;
    }
    onChange(formatted);
  }

  return (
    <DatePicker
      value={pickerValue}
      onChange={handleChange as (date: DateObject | null) => void}
      calendar={persian}
      locale={persian_fa}
      disabled={disabled}
      calendarPosition="bottom-right"
      inputClass={cn(
        "flex h-11 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      placeholder={placeholder}
      containerStyle={{ width: "100%" }}
    />
  );
}

export function toShamsi(gregorianDate: string | null | undefined): string {
  if (!gregorianDate) return "";
  try {
    const date = new DateObject({ date: gregorianDate, calendar: gregorian, locale: gregorian_en });
    return date.convert(persian, persian_fa).format("YYYY/MM/DD");
  } catch {
    return gregorianDate;
  }
}
