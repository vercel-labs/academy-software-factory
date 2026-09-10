import { defineTool } from "eve/tools";
import { z } from "zod";
import { addEvidence, evidenceSchema, workOrderSchema } from "../lib/work-order.js";
export default defineTool({
  description: "Append an observation, check, or decision to the current work order. Returns the updated record.",
  inputSchema: z.object({ workOrder: workOrderSchema, evidence: evidenceSchema.omit({ recordedAt: true }) }),
  execute: ({ workOrder, evidence }) => addEvidence(workOrder, evidence),
});
