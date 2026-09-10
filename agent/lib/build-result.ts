import { z } from "zod";
export const buildResultSchema = z.object({
  base: z.string().min(1),
  branch: z.string().min(1),
  pushed: z.boolean(),
  changes: z.array(z.object({ path: z.string().min(1), summary: z.string().min(1) })),
  deviations: z.array(z.string().min(1)),
});
export type BuildResult = z.infer<typeof buildResultSchema>;
