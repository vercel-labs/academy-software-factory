import { z } from "zod";
import { riskSchema, workTypeSchema } from "./work-order.js";
export const classificationSchema = z.object({
  actionable: z.boolean(),
  type: workTypeSchema,
  risk: riskSchema,
  confidence: z.number().min(0).max(1),
  rationale: z.string().min(1),
  questions: z.array(z.string().min(1)),
});
export type Classification = z.infer<typeof classificationSchema>;
