import { defineAgent } from "eve";
import { MODELS } from "../../lib/models.js";
import { investigationSchema } from "../../lib/investigation.js";
export default defineAgent({
  description: "Check an issue against repository evidence in an isolated checkout. Return reproducible observations without changing the product.",
  model: MODELS.investigator,
  outputSchema: investigationSchema,
});
