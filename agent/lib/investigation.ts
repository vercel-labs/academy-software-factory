import { z } from "zod";
export const investigationSchema = z.object({
  claimSupported: z.boolean(),
  evidence: z.array(z.object({
    command: z.string().nullable(),
    result: z.string().min(1),
    summary: z.string().min(1),
  })).min(1),
});
export type Investigation = z.infer<typeof investigationSchema>;
