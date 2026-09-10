import { defineTool } from "eve/tools";
import { classificationSchema } from "../lib/classification.js";
import { routeClassification } from "../lib/routing.js";
export default defineTool({
  description: "Apply deterministic lane and approval policy to a validated classification.",
  inputSchema: classificationSchema,
  execute: routeClassification,
});
