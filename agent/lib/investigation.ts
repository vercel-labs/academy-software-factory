import { z } from "zod";
export const investigationSchema = z.object({
  claimSupported: z.boolean(),
  disposition: z.enum(["proceed", "needs-clarification", "unsupported"]),
  openQuestions: z.array(z.string().min(1)),
  problemStatement: z.string(),
  affectedFiles: z.array(z.string()),
  approach: z.string(),
  acceptanceCriteria: z.array(z.string()),
  testStrategy: z.array(z.string()),
  risks: z.array(z.string()),
  evidence: z.array(z.object({
    command: z.string().nullable(),
    result: z.string().min(1),
    summary: z.string().min(1),
  })).min(1),
});
export type Investigation = z.infer<typeof investigationSchema>;
