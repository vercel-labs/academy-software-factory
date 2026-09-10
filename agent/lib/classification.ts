import { z } from "zod";
import { riskSchema, workTypeSchema } from "./work-order.js";
export const classificationSchema = z.object({
  actionable: z.boolean(),
  type: workTypeSchema,
  risk: riskSchema,
  confidence: z.number().min(0).max(1),
  rationale: z.string().min(1),
  questions: z.array(z.string().min(1)),
}).superRefine((value, ctx) => {
  if ((!value.actionable || value.type === "unknown") && value.questions.length === 0) {
    ctx.addIssue({ code: "custom", path: ["questions"], message: "Unclear work needs a focused question." });
  }
  if (value.actionable && value.questions.length > 0) {
    ctx.addIssue({ code: "custom", path: ["questions"], message: "Actionable work cannot carry unresolved questions." });
  }
});
export type Classification = z.infer<typeof classificationSchema>;
