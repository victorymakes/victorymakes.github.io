import "server-only";
import { z } from "zod";

export const schema = z.object({
  // common
  NEXT_PUBLIC_APP_URL: z.url(),
});

export const env = schema.parse(process.env);
