import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
export default defineTool({
  description: "Request a human decision on a consequential specification. Implementation must wait for this approved tool result.",
  approval: always(),
  inputSchema: z.object({
    workOrderId: z.string().min(1),
    approach: z.string().min(1),
    risks: z.array(z.string().min(1)),
    acceptanceCriteria: z.array(z.string().min(1)).min(1),
  }),
  execute: input => ({ approved: true, workOrderId: input.workOrderId, specification: input }),
});
