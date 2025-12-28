import { z } from "zod";

export const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_AHREFS_ANALYTICS_ID: z.string().optional(),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_AHREFS_ANALYTICS_ID: process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_ID,
});
