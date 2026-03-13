import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, pattern = "MMM d, yyyy"): string {
  try {
    return format(parseISO(dateString), pattern);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  return formatDate(dateString, "MMM d, yyyy 'at' h:mm a");
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function todayDateString(): string {
  return new Date().toISOString().split("T")[0];
}
