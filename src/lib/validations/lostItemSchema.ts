import { z } from "zod";

const itemCategoryValues = [
  "electronics",
  "clothing",
  "accessories",
  "documents",
  "keys",
  "luggage",
  "jewelry",
  "other",
] as const;

export const lostItemSchema = z.object({
  hotelId: z.string().min(1, "Hotel is required"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Please provide more detail (min 10 characters)")
    .max(1000),
  category: z.enum(itemCategoryValues, "Please select a category"),
  dateLastSeen: z.string().min(1, "Date is required"),
  locationLastSeen: z
    .string()
    .min(2, "Please describe where you last saw the item"),
  photoUrls: z.array(z.string()).optional(),
});

export type LostItemFormData = z.infer<typeof lostItemSchema>;
