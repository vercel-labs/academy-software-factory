import { z } from "zod";
const risk = z.enum(["none", "low", "medium", "high"]);
export const verificationSchema = z.object({
  verdict: z.enum(["approve", "request-changes", "reject"]),
  criteria: z.array(z.object({ criterion: z.string().min(1), passed: z.boolean(), evidence: z.string().min(1) })).min(1),
  blockingFindings: z.array(z.string().min(1)),
  riskAssessment: z.object({ compatibility: risk, performance: risk, security: risk, sideEffects: risk }),
  verification: z.array(z.object({ command: z.string().min(1), result: z.string().min(1) })).min(1),
  summary: z.string().min(1),
});
export type Verification = z.infer<typeof verificationSchema>;
