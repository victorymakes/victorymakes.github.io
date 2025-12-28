import { z } from "zod";

export const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
