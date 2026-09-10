import { z } from "zod";

export const workTypeSchema = z.enum(["documentation", "bug", "public-api", "unknown"]);
export const riskSchema = z.enum(["low", "medium", "high"]);
export const laneSchema = z.enum(["documentation", "bug", "public-api", "manual"]);
export const evidenceSchema = z.object({
  kind: z.enum(["observation", "command", "test", "decision", "diff"]),
  summary: z.string().min(1),
  details: z.string().optional(),
  recordedAt: z.iso.datetime(),
});
export const issueSourceSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string(),
  url: z.url(),
});
export const workRouteSchema = z.object({
  lane: laneSchema,
  approvalRequired: z.boolean(),
  reason: z.string().min(1),
});
export const workOrderSchema = z.object({
  id: z.string().min(1),
  source: issueSourceSchema,
  status: z.enum(["received", "needs-clarification", "routed", "investigating", "awaiting-approval", "building", "verifying", "ready-for-draft-pr", "stopped"]),
  evidence: z.array(evidenceSchema).default([]),
  classification: z.object({
    actionable: z.boolean(), confidence: z.number().min(0).max(1),
    questions: z.array(z.string()), rationale: z.string(),
    risk: riskSchema, type: workTypeSchema,
  }).optional(),
  route: workRouteSchema.optional(),
});
export type WorkOrder = z.infer<typeof workOrderSchema>;
export type WorkRoute = z.infer<typeof workRouteSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;

export function createWorkOrder(source: z.infer<typeof issueSourceSchema>): WorkOrder {
  return workOrderSchema.parse({ id: `issue-${source.number}`, source, status: "received", evidence: [] });
}
export function addEvidence(workOrder: WorkOrder, evidence: Omit<Evidence, "recordedAt">): WorkOrder {
  return workOrderSchema.parse({
    ...workOrder,
    evidence: [...workOrder.evidence, { ...evidence, recordedAt: new Date().toISOString() }],
  });
}
