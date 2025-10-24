import { z } from "zod";
import { ObjectId } from "bson";

// Custom Zod schema to validate and transform MongoDB ObjectId to string
export const ObjectIdtoStringSchema = z.custom<ObjectId>().transform((val) => val.toString());

// Custom Zod schema to validate and transform Date to ISO string
export const DateToStringSchema = z.union([z.date(), z.string()]).transform((val) => {
  if (val instanceof Date) {
    return val.toISOString();
  }
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date.toISOString();
});

export const ClientBaseTimestamps = z.object({
  createdAt: DateToStringSchema.optional().default(() => new Date().toISOString()),
  updatedAt: DateToStringSchema.optional().default(() => new Date().toISOString()),
  deletedAt: DateToStringSchema.nullable().optional().default(null),
});

export const ServerBaseTimestamps = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
});
