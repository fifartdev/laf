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

export const foundItemSchema = z.object({
  hotelId: z.string().min(1, "Hotel is required"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Please provide more detail (min 10 characters)")
    .max(1000),
  category: z.enum(itemCategoryValues, "Please select a category"),
  dateFound: z.string().min(1, "Date is required"),
  locationFound: z.string().min(2, "Please describe where the item was found"),
  storageLocation: z
    .string()
    .min(2, "Please describe where the item is being stored"),
  photoUrls: z.array(z.string()).optional(),
});

export type FoundItemFormData = z.infer<typeof foundItemSchema>;
