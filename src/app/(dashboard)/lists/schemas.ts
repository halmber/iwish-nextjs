import { z } from "zod";

export const wishSchema = z.object({
  listId: z.string().min(1, "Select list first"),
  title: z.string().min(2, "Title is required"),
  desireLvl: z.number().min(1).max(5, "Desire level must be between 1 and 5"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  currency: z.string().min(1, "Currency is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().max(500, "Description is too long").optional(),
  desiredGiftDate: z.date().nullable().optional(),
  imageUrl: z.string().optional(),
});
export type WishSchemaType = z.infer<typeof wishSchema>;

export const wishlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  visibility: z.string(),
});
export type WishlistSchemaType = z.infer<typeof wishlistSchema>;
