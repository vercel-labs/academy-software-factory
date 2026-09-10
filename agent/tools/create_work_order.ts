import { defineTool } from "eve/tools";
import { createWorkOrder, issueSourceSchema } from "../lib/work-order.js";
export default defineTool({
  description: "Initialize the evidence record for one issue.",
  inputSchema: issueSourceSchema,
  execute: createWorkOrder,
});
